package com.employee360.service;

import com.employee360.dto.*;
import com.employee360.entity.*;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedbackInvitationService {

    private final FeedbackInvitationRepository invitationRepository;
    private final FeedbackSubmissionRepository submissionRepository;
    private final FeedbackSubmissionItemRepository submissionItemRepository;
    private final FeedbackQuestionRepository questionRepository;
    private final FeedbackCampaignService campaignService;
    private final EmailService emailService;
    private final com.employee360.repository.EmailLogRepository emailLogRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public FeedbackInvitationService(FeedbackInvitationRepository invitationRepository,
                                     FeedbackSubmissionRepository submissionRepository,
                                     FeedbackSubmissionItemRepository submissionItemRepository,
                                     FeedbackQuestionRepository questionRepository,
                                     FeedbackCampaignService campaignService,
                                     EmailService emailService,
                                     com.employee360.repository.EmailLogRepository emailLogRepository) {
        this.invitationRepository = invitationRepository;
        this.submissionRepository = submissionRepository;
        this.submissionItemRepository = submissionItemRepository;
        this.questionRepository = questionRepository;
        this.campaignService = campaignService;
        this.emailService = emailService;
        this.emailLogRepository = emailLogRepository;
    }

    @Transactional
    public void clearAllFeedbackData() {
        submissionItemRepository.deleteAll();
        submissionRepository.deleteAll();
        invitationRepository.deleteAll();
        emailLogRepository.deleteAll();
    }

    public String resolvePublicBaseUrl(FeedbackCampaign campaign) {
        String envBase = getEnvOrDotEnv("APP_BASE_URL");
        if (envBase != null && !envBase.isBlank() && !envBase.contains("enterprise.com") && !envBase.contains("example.com")) {
            if (!envBase.contains("localhost") && !envBase.contains("127.0.0.1")) {
                return cleanUrl(envBase);
            }
        }

        if (campaign != null && campaign.getPublicBaseUrl() != null && !campaign.getPublicBaseUrl().isBlank()) {
            String u = campaign.getPublicBaseUrl().trim();
            if (!u.contains("enterprise.com") && !u.contains("example.com")) {
                return cleanUrl(u);
            }
        }

        if (envBase != null && !envBase.isBlank() && !envBase.contains("enterprise.com") && !envBase.contains("example.com")) {
            return cleanUrl(envBase);
        }

        if (frontendUrl != null && !frontendUrl.isBlank() && !frontendUrl.contains("enterprise.com") && !frontendUrl.contains("example.com")) {
            return cleanUrl(frontendUrl);
        }
        return "http://localhost:5173";
    }

    private String getEnvOrDotEnv(String key) {
        String val = System.getProperty(key, System.getenv(key));
        if (val != null && !val.isBlank()) {
            return val.trim();
        }
        for (String p : Arrays.asList(".env", "../.env", "d:/Spring/Employee 360  Review/.env")) {
            java.io.File f = new java.io.File(p);
            if (f.exists() && f.isFile()) {
                try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(f))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.startsWith(key + "=")) {
                            return line.substring((key + "=").length()).trim();
                        }
                    }
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private String cleanUrl(String url) {
        if (url == null) return "http://localhost:5173";
        String trimmed = url.trim();
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }

    public String buildPublicFeedbackUrl(FeedbackCampaign campaign, String token) {
        return resolvePublicBaseUrl(campaign) + "/feedback/" + token;
    }

    @Transactional
    public FeedbackInvitation sendInvitation(FeedbackInvitationRequest req) {
        FeedbackCampaign campaign = campaignService.getActiveCampaign();

        String token = generateSecureToken();
        String tokenHash = hashToken(token);
        int days = (req.getExpiryDays() != null && req.getExpiryDays() > 0) ? req.getExpiryDays() : 14;
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(days);

        FeedbackInvitation invitation = new FeedbackInvitation(
                campaign,
                req.getReviewerName().trim(),
                req.getReviewerEmail().trim(),
                req.getReviewCategory().trim(),
                token,
                tokenHash,
                expiresAt
        );
        invitation.setInstructions(req.getInstructions());
        String publicFeedbackUrl = buildPublicFeedbackUrl(campaign, token);
        invitation.setPublicFeedbackUrl(publicFeedbackUrl);

        FeedbackInvitation saved = invitationRepository.save(invitation);

        // Send email invitation asynchronously/with fallback logging
        EmailService.EmailDispatchResult dispatch = emailService.sendFeedbackInvitation(
                saved.getReviewerName(),
                saved.getReviewerEmail(),
                campaign.getAdminName(),
                saved.getReviewCategory(),
                saved.getToken(),
                saved.getInstructions(),
                publicFeedbackUrl
        );

        saved.setEmailDeliveryStatus(dispatch.getStatus());
        saved.setEmailDeliveryError(dispatch.getErrorMessage());
        return invitationRepository.save(saved);
    }

    @Transactional
    public List<FeedbackInvitation> sendBulkInvitations(BulkInvitationRequest bulkReq) {
        List<FeedbackInvitation> results = new ArrayList<>();
        for (FeedbackInvitationRequest req : bulkReq.getInvitations()) {
            results.add(sendInvitation(req));
        }
        return results;
    }

    @Transactional
    public boolean resendInvitation(Long invitationId) {
        FeedbackInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id " + invitationId));

        if ("SUBMITTED".equalsIgnoreCase(invitation.getStatus())) {
            throw new BadRequestException("Cannot resend. This feedback invitation has already been submitted.");
        }

        FeedbackCampaign campaign = invitation.getCampaign();
        String publicFeedbackUrl = buildPublicFeedbackUrl(campaign, invitation.getToken());
        invitation.setPublicFeedbackUrl(publicFeedbackUrl);

        EmailService.EmailDispatchResult dispatch = emailService.sendFeedbackInvitation(
                invitation.getReviewerName(),
                invitation.getReviewerEmail(),
                campaign.getAdminName(),
                invitation.getReviewCategory(),
                invitation.getToken(),
                invitation.getInstructions(),
                publicFeedbackUrl
        );

        invitation.setEmailDeliveryStatus(dispatch.getStatus());
        invitation.setEmailDeliveryError(dispatch.getErrorMessage());
        invitationRepository.save(invitation);
        return dispatch.isSuccess();
    }

    @Transactional
    public FeedbackInvitation retryInvitation(Long invitationId) {
        FeedbackInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id " + invitationId));

        if ("SUBMITTED".equalsIgnoreCase(invitation.getStatus())) {
            throw new BadRequestException("Cannot retry. This feedback invitation has already been submitted.");
        }

        FeedbackCampaign campaign = invitation.getCampaign();
        String publicFeedbackUrl = buildPublicFeedbackUrl(campaign, invitation.getToken());
        invitation.setPublicFeedbackUrl(publicFeedbackUrl);

        EmailService.EmailDispatchResult dispatch = emailService.sendFeedbackInvitation(
                invitation.getReviewerName(),
                invitation.getReviewerEmail(),
                campaign.getAdminName(),
                invitation.getReviewCategory(),
                invitation.getToken(),
                invitation.getInstructions(),
                publicFeedbackUrl
        );

        invitation.setRetryCount(invitation.getRetryCount() + 1);
        invitation.setEmailDeliveryStatus(dispatch.getStatus());
        invitation.setEmailDeliveryError(dispatch.getErrorMessage());
        if (dispatch.isSuccess()) {
            invitation.setSentAt(LocalDateTime.now());
        }
        return invitationRepository.save(invitation);
    }

    @Transactional
    public void handleWebhookEvent(String event, String email, String token, String reason) {
        Optional<FeedbackInvitation> invOpt = Optional.empty();
        if (token != null && !token.isBlank()) {
            invOpt = invitationRepository.findByToken(token.trim());
        } else if (email != null && !email.isBlank()) {
            invOpt = invitationRepository.findFirstByReviewerEmailIgnoreCaseOrderBySentAtDesc(email.trim());
        }

        if (invOpt.isPresent()) {
            FeedbackInvitation inv = invOpt.get();
            if ("delivered".equalsIgnoreCase(event)) {
                inv.setEmailDeliveryStatus("DELIVERED");
                inv.setDeliveredAt(LocalDateTime.now());
            } else if ("bounced".equalsIgnoreCase(event)) {
                inv.setEmailDeliveryStatus("BOUNCED");
                inv.setEmailDeliveryError(reason != null ? reason : "Recipient mail server rejected delivery (bounced)");
            } else if ("opened".equalsIgnoreCase(event)) {
                inv.setEmailDeliveryStatus("OPENED");
                inv.setOpenedAt(LocalDateTime.now());
            }
            invitationRepository.save(inv);
        }
    }

    @Transactional
    public void deleteInvitation(Long invitationId) {
        FeedbackInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id " + invitationId));
        invitationRepository.delete(invitation);
    }

    // --- PUBLIC ENDPOINTS (NO LOGIN REQUIRED) ---

    @Transactional
    public PublicFeedbackFormDto validateAndGetForm(String token) {
        if (token == null || token.isBlank() || "preview".equalsIgnoreCase(token.trim()) || "demo".equalsIgnoreCase(token.trim())) {
            FeedbackCampaign campaign = campaignService.getActiveCampaign();
            List<FeedbackQuestion> questions = questionRepository.findByCampaignIdAndActiveTrueOrderBySortOrderAsc(campaign.getId());
            if (questions.isEmpty()) {
                questions = questionRepository.findByActiveTrueOrderBySortOrderAsc();
            }

            List<FeedbackQuestionDto> questionDtos = questions.stream()
                    .map(q -> new FeedbackQuestionDto(
                            q.getId(),
                            q.getCategoryName(),
                            q.getQuestionText(),
                            q.getQuestionType(),
                            q.getMinRating(),
                            q.getMaxRating(),
                            q.getSortOrder(),
                            q.isRequired()
                    )).collect(Collectors.toList());

            return new PublicFeedbackFormDto(
                    "preview",
                    campaign.getId(),
                    campaign.getTitle(),
                    campaign.getAdminName(),
                    campaign.getAdminTitle(),
                    "Reviewer Preview (Direct Access)",
                    "feedback@internal",
                    "GENERAL",
                    "PENDING",
                    campaign.getDescription() != null ? campaign.getDescription() : "Confidential 360-degree feedback collection evaluating leadership, communication, and performance.",
                    questionDtos
            );
        }

        FeedbackInvitation invitation = invitationRepository.findByToken(token.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid feedback invitation link. Please check your email."));

        FeedbackCampaign campaign = invitation.getCampaign();

        // Check if already submitted
        if ("SUBMITTED".equalsIgnoreCase(invitation.getStatus())) {
            PublicFeedbackFormDto dto = new PublicFeedbackFormDto();
            dto.setToken(token);
            dto.setCampaignTitle(campaign.getTitle());
            dto.setAdminName(campaign.getAdminName());
            dto.setAdminTitle(campaign.getAdminTitle());
            dto.setReviewerName(invitation.getReviewerName());
            dto.setReviewCategory(invitation.getReviewCategory());
            dto.setStatus("SUBMITTED");
            dto.setQuestions(Collections.emptyList());
            return dto;
        }

        // Check if expired
        if (invitation.getExpiresAt() != null && invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            PublicFeedbackFormDto dto = new PublicFeedbackFormDto();
            dto.setToken(token);
            dto.setCampaignTitle(campaign.getTitle());
            dto.setAdminName(campaign.getAdminName());
            dto.setAdminTitle(campaign.getAdminTitle());
            dto.setReviewerName(invitation.getReviewerName());
            dto.setReviewCategory(invitation.getReviewCategory());
            dto.setStatus("EXPIRED");
            dto.setQuestions(Collections.emptyList());
            return dto;
        }

        // Track open status for delivery tracking
        if ("SENT".equalsIgnoreCase(invitation.getEmailDeliveryStatus()) || "DELIVERED".equalsIgnoreCase(invitation.getEmailDeliveryStatus())) {
            invitation.setEmailDeliveryStatus("OPENED");
            invitation.setOpenedAt(LocalDateTime.now());
            invitationRepository.save(invitation);
        }

        // Retrieve active questions
        List<FeedbackQuestion> questions = questionRepository.findByCampaignIdAndActiveTrueOrderBySortOrderAsc(campaign.getId());
        if (questions.isEmpty()) {
            questions = questionRepository.findByActiveTrueOrderBySortOrderAsc();
        }

        List<FeedbackQuestionDto> questionDtos = questions.stream()
                .map(q -> new FeedbackQuestionDto(
                        q.getId(),
                        q.getCategoryName(),
                        q.getQuestionText(),
                        q.getQuestionType(),
                        q.getMinRating(),
                        q.getMaxRating(),
                        q.getSortOrder(),
                        q.isRequired()
                )).collect(Collectors.toList());

        return new PublicFeedbackFormDto(
                invitation.getToken(),
                campaign.getId(),
                campaign.getTitle(),
                campaign.getAdminName(),
                campaign.getAdminTitle(),
                invitation.getReviewerName(),
                invitation.getReviewerEmail(),
                invitation.getReviewCategory(),
                "PENDING",
                invitation.getInstructions(),
                questionDtos
        );
    }

    @Transactional
    public void submitFeedback(FeedbackSubmissionRequest req) {
        if (req.getToken() == null || req.getToken().isBlank()) {
            throw new BadRequestException("Missing invitation token.");
        }

        String effectiveToken = req.getToken().trim();
        FeedbackInvitation invitation;
        if ("preview".equalsIgnoreCase(effectiveToken) || "demo".equalsIgnoreCase(effectiveToken)) {
            FeedbackCampaign campaign = campaignService.getActiveCampaign();
            invitation = invitationRepository.findByToken("preview").orElseGet(() -> {
                FeedbackInvitation pi = new FeedbackInvitation(
                        campaign,
                        "Colleague (Direct Access)",
                        "feedback@internal",
                        "GENERAL",
                        "preview",
                        hashToken("preview"),
                        LocalDateTime.now().plusYears(1)
                );
                pi.setStatus("PENDING");
                return invitationRepository.save(pi);
            });
            invitation.setStatus("PENDING");
        } else {
            invitation = invitationRepository.findByToken(effectiveToken)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid or unrecognized feedback token."));

            // Single-use token enforcement
            if ("SUBMITTED".equalsIgnoreCase(invitation.getStatus())) {
                throw new BadRequestException("This feedback form has already been submitted. Thank you for your response.");
            }

            if (invitation.getExpiresAt() != null && invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("This feedback invitation link has expired.");
            }
        }

        FeedbackCampaign campaign = invitation.getCampaign();

        // Calculate overall score
        double totalScore = 0;
        int ratingCount = 0;
        List<FeedbackSubmissionItem> items = new ArrayList<>();

        FeedbackSubmission submission = new FeedbackSubmission(
                campaign,
                invitation,
                BigDecimal.ZERO,
                req.getSummaryFeedback() != null ? req.getSummaryFeedback().trim() : null,
                req.getStrengthsComment() != null ? req.getStrengthsComment().trim() : null,
                req.getImprovementsComment() != null ? req.getImprovementsComment().trim() : null
        );

        for (FeedbackSubmissionRequest.QuestionResponseItem rItem : req.getItems()) {
            if (rItem.getQuestionId() == null) continue;
            FeedbackQuestion q = questionRepository.findById(rItem.getQuestionId()).orElse(null);
            if (q == null) continue;

            if (rItem.getRatingScore() != null && rItem.getRatingScore() > 0) {
                totalScore += rItem.getRatingScore();
                ratingCount++;
            }

            FeedbackSubmissionItem subItem = new FeedbackSubmissionItem(
                    submission,
                    q,
                    q.getCategoryName(),
                    rItem.getRatingScore(),
                    rItem.getComment() != null ? rItem.getComment().trim() : null
            );
            items.add(subItem);
        }

        BigDecimal overall = ratingCount > 0
                ? BigDecimal.valueOf(totalScore / ratingCount).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.valueOf(4.00);

        submission.setOverallRating(overall);
        submission.setItems(items);

        // Atomic lock and mark submitted (only for token-specific invitations, preview remains reusable)
        if (!"preview".equalsIgnoreCase(invitation.getToken())) {
            invitation.setStatus("SUBMITTED");
            invitation.setEmailDeliveryStatus("SUBMITTED");
            invitation.setSubmittedAt(LocalDateTime.now());
            invitationRepository.save(invitation);
        }

        submissionRepository.save(submission);
    }

    // --- ADMIN REVIEWS & INSPECTION ---

    @Transactional(readOnly = true)
    public List<AdminReviewItemDetailDto> getSubmissions(String category, String query) {
        String cat = (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) ? category : null;
        String q = (query != null && !query.isBlank()) ? query.trim() : null;

        List<FeedbackSubmission> submissions = submissionRepository.searchSubmissions(cat, q);
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

        return submissions.stream().map(s -> {
            FeedbackInvitation inv = s.getInvitation();
            List<AdminReviewItemDetailDto.QuestionRatingDetailDto> qRatings = s.getItems().stream()
                    .map(it -> new AdminReviewItemDetailDto.QuestionRatingDetailDto(
                            it.getQuestion().getId(),
                            it.getCategoryName(),
                            it.getQuestion().getQuestionText(),
                            it.getRatingScore(),
                            it.getComment()
                    )).collect(Collectors.toList());

            return new AdminReviewItemDetailDto(
                    s.getId(),
                    inv.getId(),
                    inv.getReviewerName(),
                    inv.getReviewerEmail(),
                    inv.getReviewCategory(),
                    s.getOverallRating(),
                    s.getSubmittedAt() != null ? s.getSubmittedAt().format(fmt) : "",
                    s.getSummaryFeedback(),
                    s.getStrengthsComment(),
                    s.getImprovementsComment(),
                    qRatings
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminReviewItemDetailDto getSubmissionById(Long id) {
        FeedbackSubmission s = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id " + id));

        FeedbackInvitation inv = s.getInvitation();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

        List<AdminReviewItemDetailDto.QuestionRatingDetailDto> qRatings = s.getItems().stream()
                .map(it -> new AdminReviewItemDetailDto.QuestionRatingDetailDto(
                        it.getQuestion().getId(),
                        it.getCategoryName(),
                        it.getQuestion().getQuestionText(),
                        it.getRatingScore(),
                        it.getComment()
                )).collect(Collectors.toList());

        return new AdminReviewItemDetailDto(
                s.getId(),
                inv.getId(),
                inv.getReviewerName(),
                inv.getReviewerEmail(),
                inv.getReviewCategory(),
                s.getOverallRating(),
                s.getSubmittedAt() != null ? s.getSubmittedAt().format(fmt) : "",
                s.getSummaryFeedback(),
                s.getStrengthsComment(),
                s.getImprovementsComment(),
                qRatings
        );
    }

    @Transactional(readOnly = true)
    public List<FeedbackInvitation> getInvitations(String status, String category, String query) {
        String stat = (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) ? status.toUpperCase() : null;
        String cat = (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) ? category : null;
        String q = (query != null && !query.isBlank()) ? query.trim() : null;

        List<FeedbackInvitation> list = invitationRepository.searchInvitations(stat, cat, q);
        FeedbackCampaign campaign = campaignService.getActiveCampaign();
        for (FeedbackInvitation inv : list) {
            if (inv.getPublicFeedbackUrl() == null || inv.getPublicFeedbackUrl().isBlank()) {
                inv.setPublicFeedbackUrl(buildPublicFeedbackUrl(campaign, inv.getToken()));
            }
        }
        return list;
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return token;
        }
    }
}
