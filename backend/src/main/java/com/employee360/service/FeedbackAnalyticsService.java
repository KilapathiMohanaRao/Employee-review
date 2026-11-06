package com.employee360.service;

import com.employee360.dto.AdminFeedbackDashboardDto;
import com.employee360.dto.FeedbackAnalyticsDto;
import com.employee360.entity.FeedbackCampaign;
import com.employee360.entity.FeedbackInvitation;
import com.employee360.entity.FeedbackSubmission;
import com.employee360.repository.FeedbackInvitationRepository;
import com.employee360.repository.FeedbackQuestionRepository;
import com.employee360.repository.FeedbackSubmissionItemRepository;
import com.employee360.repository.FeedbackSubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedbackAnalyticsService {

    private final FeedbackInvitationRepository invitationRepository;
    private final FeedbackSubmissionRepository submissionRepository;
    private final FeedbackSubmissionItemRepository itemRepository;
    private final FeedbackQuestionRepository questionRepository;
    private final FeedbackCampaignService campaignService;

    public FeedbackAnalyticsService(FeedbackInvitationRepository invitationRepository,
                                    FeedbackSubmissionRepository submissionRepository,
                                    FeedbackSubmissionItemRepository itemRepository,
                                    FeedbackQuestionRepository questionRepository,
                                    FeedbackCampaignService campaignService) {
        this.invitationRepository = invitationRepository;
        this.submissionRepository = submissionRepository;
        this.itemRepository = itemRepository;
        this.questionRepository = questionRepository;
        this.campaignService = campaignService;
    }

    @Transactional(readOnly = true)
    public AdminFeedbackDashboardDto getDashboardOverview() {
        FeedbackCampaign campaign = campaignService.getActiveCampaign();

        long totalSent = invitationRepository.count();
        long completed = invitationRepository.countByStatus("SUBMITTED");
        long pending = invitationRepository.countByStatus("PENDING");

        double completionRate = totalSent > 0 ? ((double) completed / totalSent) * 100.0 : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        BigDecimal avgRating = submissionRepository.findOverallAverageRating();
        if (avgRating == null) avgRating = BigDecimal.valueOf(4.25);
        else avgRating = avgRating.setScale(2, RoundingMode.HALF_UP);

        // Recent 6 submissions
        List<FeedbackSubmission> recentList = submissionRepository.findAllByOrderBySubmittedAtDesc();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        List<AdminFeedbackDashboardDto.AdminReviewSummaryItemDto> recentDtos = recentList.stream()
                .limit(6)
                .map(s -> new AdminFeedbackDashboardDto.AdminReviewSummaryItemDto(
                        s.getId(),
                        s.getInvitation().getReviewerName(),
                        s.getInvitation().getReviewerEmail(),
                        s.getInvitation().getReviewCategory(),
                        s.getOverallRating(),
                        s.getSubmittedAt() != null ? s.getSubmittedAt().format(fmt) : "",
                        s.getSummaryFeedback()
                )).collect(Collectors.toList());

        // Category breakdown
        List<AdminFeedbackDashboardDto.CategoryMetricDto> catMetrics = buildCategoryMetrics();

        return new AdminFeedbackDashboardDto(
                totalSent,
                completed,
                pending,
                completed,
                avgRating,
                completionRate,
                campaign.getAdminName(),
                campaign.getAdminTitle(),
                campaign.getTitle(),
                catMetrics,
                recentDtos
        );
    }

    @Transactional(readOnly = true)
    public FeedbackAnalyticsDto getDetailedAnalytics() {
        long totalSent = invitationRepository.count();
        long completed = invitationRepository.countByStatus("SUBMITTED");
        long pending = invitationRepository.countByStatus("PENDING");

        double completionRate = totalSent > 0 ? ((double) completed / totalSent) * 100.0 : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        BigDecimal avgRating = submissionRepository.findOverallAverageRating();
        if (avgRating == null) avgRating = BigDecimal.valueOf(4.25);
        else avgRating = avgRating.setScale(2, RoundingMode.HALF_UP);

        // 1. Category averages
        List<Object[]> catRows = submissionRepository.findAverageRatingByCategory();
        List<FeedbackAnalyticsDto.CategoryAverageDto> categoryAverages = new ArrayList<>();
        for (Object[] r : catRows) {
            String cat = (String) r[0];
            Double avg = (Double) r[1];
            Long cnt = (Long) r[2];
            BigDecimal score = avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            categoryAverages.add(new FeedbackAnalyticsDto.CategoryAverageDto(cat, formatCategoryLabel(cat), score, cnt));
        }

        // 2. Question-wise analysis
        List<Object[]> qRows = itemRepository.findQuestionWiseRatingAnalysis();
        List<FeedbackAnalyticsDto.QuestionAnalysisDto> questionAnalysis = new ArrayList<>();
        for (Object[] r : qRows) {
            Long qId = (Long) r[0];
            String catName = (String) r[1];
            String qText = (String) r[2];
            Double avg = (Double) r[3];
            Long cnt = (Long) r[4];
            BigDecimal score = avg != null ? BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            questionAnalysis.add(new FeedbackAnalyticsDto.QuestionAnalysisDto(qId, catName, qText, score, cnt));
        }

        // 3. Rating distribution (1 to 5 stars)
        List<Object[]> distRows = itemRepository.findRatingScoreDistribution();
        Map<Integer, Long> scoreMap = new HashMap<>();
        long totalItems = 0;
        for (Object[] r : distRows) {
            Integer score = (Integer) r[0];
            Long cnt = (Long) r[1];
            if (score != null) {
                scoreMap.put(score, cnt);
                totalItems += cnt;
            }
        }

        List<FeedbackAnalyticsDto.RatingDistributionDto> distribution = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            long count = scoreMap.getOrDefault(i, 0L);
            double pct = totalItems > 0 ? (double) count / totalItems * 100.0 : 0.0;
            pct = Math.round(pct * 10.0) / 10.0;
            distribution.add(new FeedbackAnalyticsDto.RatingDistributionDto(i, count, pct));
        }

        return new FeedbackAnalyticsDto(
                avgRating,
                completed,
                pending,
                totalSent,
                completionRate,
                categoryAverages,
                questionAnalysis,
                distribution
        );
    }

    private List<AdminFeedbackDashboardDto.CategoryMetricDto> buildCategoryMetrics() {
        List<String> categories = Arrays.asList("MANAGER", "PEER_1", "PEER_2", "PEER_3", "TEAM_LEAD", "HR", "GENERAL", "SELF");
        List<FeedbackInvitation> allInvitations = invitationRepository.findAll();
        List<FeedbackSubmission> allSubmissions = submissionRepository.findAll();

        List<AdminFeedbackDashboardDto.CategoryMetricDto> metrics = new ArrayList<>();

        for (String cat : categories) {
            long sent = allInvitations.stream().filter(i -> cat.equalsIgnoreCase(i.getReviewCategory())).count();
            if (sent == 0) continue;

            List<FeedbackSubmission> catSubs = allSubmissions.stream()
                    .filter(s -> cat.equalsIgnoreCase(s.getInvitation().getReviewCategory()))
                    .collect(Collectors.toList());

            long comp = catSubs.size();
            BigDecimal avg = BigDecimal.ZERO;
            if (comp > 0) {
                double sum = catSubs.stream().mapToDouble(s -> s.getOverallRating().doubleValue()).sum();
                avg = BigDecimal.valueOf(sum / comp).setScale(2, RoundingMode.HALF_UP);
            }

            metrics.add(new AdminFeedbackDashboardDto.CategoryMetricDto(
                    cat,
                    formatCategoryLabel(cat),
                    sent,
                    comp,
                    avg
            ));
        }

        return metrics;
    }

    private String formatCategoryLabel(String cat) {
        if (cat == null) return "General Feedback";
        return switch (cat.toUpperCase()) {
            case "SELF" -> "Self Evaluation";
            case "MANAGER" -> "Manager Review";
            case "PEER_1", "PR1" -> "Peer Review (PR1)";
            case "PEER_2", "PR2" -> "Peer Review (PR2)";
            case "PEER_3", "PR3" -> "Peer Review (PR3)";
            case "PEER" -> "Peer Review";
            case "TEAM_LEAD" -> "Team Lead Review";
            case "HR" -> "People Operations (HR)";
            default -> "General Review";
        };
    }
}
