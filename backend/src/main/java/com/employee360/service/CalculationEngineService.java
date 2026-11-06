package com.employee360.service;

import com.employee360.dto.BlindSpotHiddenStrengthDto;
import com.employee360.dto.CompetencyScorecardDto;
import com.employee360.dto.StrengthDevelopmentDto;
import com.employee360.entity.*;
import com.employee360.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CalculationEngineService {

    private final AssessmentAssignmentRepository assignmentRepository;
    private final AssessmentRepository assessmentRepository;
    private final ReviewerRelationshipRepository reviewerRelationshipRepository;
    private final AssessmentResponseRepository responseRepository;
    private final CompetencyRepository competencyRepository;
    private final CompetencySummaryRepository summaryRepository;

    @Value("${app.calculation.blind-spot-threshold:0.5}")
    private double blindSpotThreshold;

    @Value("${app.calculation.hidden-strength-threshold:-0.5}")
    private double hiddenStrengthThreshold;

    public CalculationEngineService(AssessmentAssignmentRepository assignmentRepository,
                                    AssessmentRepository assessmentRepository,
                                    ReviewerRelationshipRepository reviewerRelationshipRepository,
                                    AssessmentResponseRepository responseRepository,
                                    CompetencyRepository competencyRepository,
                                    CompetencySummaryRepository summaryRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assessmentRepository = assessmentRepository;
        this.reviewerRelationshipRepository = reviewerRelationshipRepository;
        this.responseRepository = responseRepository;
        this.competencyRepository = competencyRepository;
        this.summaryRepository = summaryRepository;
    }

    @Transactional
    public List<CompetencySummary> calculateAssignmentSummaries(Long assignmentId) {
        AssessmentAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        List<Assessment> assessments = assessmentRepository.findByAssignmentId(assignmentId);
        List<Competency> competencies = competencyRepository.findByActiveTrueOrderBySortOrderAsc();

        // Map responses by competency -> reviewType -> list of valid scores
        Map<Long, Map<String, List<Integer>>> compScores = new HashMap<>();
        Map<Long, Integer> compItemCount = new HashMap<>();

        for (Competency c : competencies) {
            compScores.put(c.getId(), new HashMap<>());
            compScores.get(c.getId()).put("SELF", new ArrayList<>());
            compScores.get(c.getId()).put("MANAGER", new ArrayList<>());
            compScores.get(c.getId()).put("PEER", new ArrayList<>());
            compScores.get(c.getId()).put("DIRECT_REPORT", new ArrayList<>());
            compScores.get(c.getId()).put("CROSS_FUNCTIONAL", new ArrayList<>());
            compScores.get(c.getId()).put("OTHER_STAKEHOLDER", new ArrayList<>());
            compItemCount.put(c.getId(), c.getBehaviours().size());
        }

        for (Assessment assessment : assessments) {
            String rType = assessment.getReviewerRelationship().getReviewType();
            List<AssessmentResponse> responses = responseRepository.findByAssessmentId(assessment.getId());

            for (AssessmentResponse resp : responses) {
                if (resp.getScore() != null && !resp.isNotObserved() && resp.getScore() >= 1 && resp.getScore() <= 5) {
                    Long compId = resp.getBehaviour().getCompetency().getId();
                    if (compScores.containsKey(compId)) {
                        compScores.get(compId).get(rType).add(resp.getScore());
                    }
                }
            }
        }

        AssessmentCycle cycle = assignment.getCycle();
        List<CompetencySummary> summaries = new ArrayList<>();

        for (Competency comp : competencies) {
            Map<String, List<Integer>> typeMap = compScores.get(comp.getId());

            BigDecimal selfScore = calcAvg(typeMap.get("SELF"));
            BigDecimal mgrScore = calcAvg(typeMap.get("MANAGER"));
            BigDecimal peerScore = calcAvg(typeMap.get("PEER"));
            BigDecimal drScore = calcAvg(typeMap.get("DIRECT_REPORT"));
            BigDecimal cfScore = calcAvg(typeMap.get("CROSS_FUNCTIONAL"));
            BigDecimal osScore = calcAvg(typeMap.get("OTHER_STAKEHOLDER"));

            // Calculate weighted others average
            BigDecimal othersAvg = calcWeightedOthersAvg(cycle, mgrScore, peerScore, drScore, cfScore, osScore);

            BigDecimal gap = null;
            if (selfScore != null && othersAvg != null) {
                gap = selfScore.subtract(othersAvg).setScale(2, RoundingMode.HALF_UP);
            }

            String insight = determineInsight(selfScore, othersAvg, gap, mgrScore, peerScore, drScore, cfScore);

            CompetencySummary summary = summaryRepository.findByAssignmentIdAndCompetencyId(assignmentId, comp.getId())
                    .orElse(new CompetencySummary());

            summary.setAssignment(assignment);
            summary.setCompetency(comp);
            summary.setItemCount(compItemCount.getOrDefault(comp.getId(), 0));
            summary.setSelfScore(selfScore);
            summary.setManagerScore(mgrScore);
            summary.setPeerScore(peerScore);
            summary.setDirectReportScore(drScore);
            summary.setCrossFunctionalScore(cfScore);
            summary.setOtherStakeholderScore(osScore);
            summary.setOthersAverage(othersAvg);
            summary.setGapScore(gap);
            summary.setPerformanceInsight(insight);
            summary.setCalculatedAt(LocalDateTime.now());

            summaries.add(summary);
        }

        // Rank competencies based on othersAverage descending (nulls last)
        summaries.sort((a, b) -> {
            if (a.getOthersAverage() == null && b.getOthersAverage() == null) return 0;
            if (a.getOthersAverage() == null) return 1;
            if (b.getOthersAverage() == null) return -1;
            return b.getOthersAverage().compareTo(a.getOthersAverage());
        });

        int rank = 1;
        BigDecimal totalScore = BigDecimal.ZERO;
        int validScoreCount = 0;

        for (CompetencySummary s : summaries) {
            if (s.getOthersAverage() != null) {
                s.setCompetencyRank(rank++);
                totalScore = totalScore.add(s.getOthersAverage());
                validScoreCount++;
            } else {
                s.setCompetencyRank(null);
            }
        }

        summaryRepository.saveAll(summaries);

        // Update overall assignment score and completion rate
        if (validScoreCount > 0) {
            BigDecimal overall = totalScore.divide(BigDecimal.valueOf(validScoreCount), 2, RoundingMode.HALF_UP);
            assignment.setOverallScore(overall);
        }

        long totalReviews = reviewerRelationshipRepository.findByAssignmentId(assignment.getId()).size();
        long completedReviews = assessmentRepository.findByAssignmentIdAndStatus(assignment.getId(), "SUBMITTED").size();
        if (totalReviews > 0) {
            double rate = ((double) completedReviews / totalReviews) * 100.0;
            assignment.setCompletionRate(BigDecimal.valueOf(rate).setScale(2, RoundingMode.HALF_UP));
        } else {
            assignment.setCompletionRate(BigDecimal.ZERO);
        }

        assignmentRepository.save(assignment);
        return summaries;
    }

    private BigDecimal calcAvg(List<Integer> scores) {
        if (scores == null || scores.isEmpty()) return null;
        double sum = 0;
        for (int s : scores) sum += s;
        return BigDecimal.valueOf(sum / scores.size()).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calcWeightedOthersAvg(AssessmentCycle cycle,
                                             BigDecimal mgr, BigDecimal peer,
                                             BigDecimal dr, BigDecimal cf, BigDecimal os) {
        BigDecimal totalWeight = BigDecimal.ZERO;
        BigDecimal weightedSum = BigDecimal.ZERO;

        if (mgr != null && cycle.getWeightManager() != null && cycle.getWeightManager().compareTo(BigDecimal.ZERO) > 0) {
            weightedSum = weightedSum.add(mgr.multiply(cycle.getWeightManager()));
            totalWeight = totalWeight.add(cycle.getWeightManager());
        }
        if (peer != null && cycle.getWeightPeer() != null && cycle.getWeightPeer().compareTo(BigDecimal.ZERO) > 0) {
            weightedSum = weightedSum.add(peer.multiply(cycle.getWeightPeer()));
            totalWeight = totalWeight.add(cycle.getWeightPeer());
        }
        if (dr != null && cycle.getWeightDirectReport() != null && cycle.getWeightDirectReport().compareTo(BigDecimal.ZERO) > 0) {
            weightedSum = weightedSum.add(dr.multiply(cycle.getWeightDirectReport()));
            totalWeight = totalWeight.add(cycle.getWeightDirectReport());
        }
        if (cf != null && cycle.getWeightCrossFunctional() != null && cycle.getWeightCrossFunctional().compareTo(BigDecimal.ZERO) > 0) {
            weightedSum = weightedSum.add(cf.multiply(cycle.getWeightCrossFunctional()));
            totalWeight = totalWeight.add(cycle.getWeightCrossFunctional());
        }
        if (os != null) {
            BigDecimal osWeight = new BigDecimal("10.00");
            weightedSum = weightedSum.add(os.multiply(osWeight));
            totalWeight = totalWeight.add(osWeight);
        }

        if (totalWeight.compareTo(BigDecimal.ZERO) == 0) {
            // Unweighted fallback if all weights zero or simple average
            List<BigDecimal> valids = Arrays.asList(mgr, peer, dr, cf, os).stream()
                    .filter(Objects::nonNull).collect(Collectors.toList());
            if (valids.isEmpty()) return null;
            BigDecimal sum = valids.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
            return sum.divide(BigDecimal.valueOf(valids.size()), 2, RoundingMode.HALF_UP);
        }

        return weightedSum.divide(totalWeight, 2, RoundingMode.HALF_UP);
    }

    private String determineInsight(BigDecimal self, BigDecimal others, BigDecimal gap,
                                    BigDecimal mgr, BigDecimal peer, BigDecimal dr, BigDecimal cf) {
        if (others == null) return "INSUFFICIENT_FEEDBACK";

        if (gap != null) {
            if (gap.doubleValue() >= blindSpotThreshold) {
                return "BLIND_SPOT";
            }
            if (gap.doubleValue() <= hiddenStrengthThreshold) {
                return "HIDDEN_STRENGTH";
            }
        }

        if (others.doubleValue() >= 3.8) {
            return "ROLE_MODEL";
        }
        if (others.doubleValue() >= 3.0) {
            return "ON_TRACK";
        }
        return "NEEDS_IMPROVEMENT";
    }

    @Transactional(readOnly = true)
    public List<StrengthDevelopmentDto> calculateTopStrengths(Long assignmentId) {
        return getRankedBehaviours(assignmentId, true, 3);
    }

    @Transactional(readOnly = true)
    public List<StrengthDevelopmentDto> calculateTopDevelopmentAreas(Long assignmentId) {
        return getRankedBehaviours(assignmentId, false, 3);
    }

    private List<StrengthDevelopmentDto> getRankedBehaviours(Long assignmentId, boolean top, int limit) {
        List<AssessmentResponse> allResponses = responseRepository.findAllResponsesForAssignment(assignmentId);

        // Group responses by Behaviour
        Map<Long, List<Integer>> othersScores = new HashMap<>();
        Map<Long, Integer> selfScores = new HashMap<>();
        Map<Long, Behaviour> behaviourMap = new HashMap<>();

        for (AssessmentResponse r : allResponses) {
            if (r.getScore() == null || r.isNotObserved()) continue;

            Long bId = r.getBehaviour().getId();
            behaviourMap.put(bId, r.getBehaviour());

            String rType = r.getAssessment().getReviewerRelationship().getReviewType();
            if ("SELF".equalsIgnoreCase(rType)) {
                selfScores.put(bId, r.getScore());
            } else {
                othersScores.computeIfAbsent(bId, k -> new ArrayList<>()).add(r.getScore());
            }
        }

        List<StrengthDevelopmentDto> list = new ArrayList<>();
        for (Map.Entry<Long, List<Integer>> entry : othersScores.entrySet()) {
            Long bId = entry.getKey();
            List<Integer> scores = entry.getValue();
            if (scores.isEmpty()) continue;

            double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            BigDecimal avgScore = BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP);
            BigDecimal self = selfScores.containsKey(bId) ? BigDecimal.valueOf(selfScores.get(bId)) : null;

            Behaviour b = behaviourMap.get(bId);
            String compName = b.getCompetency() != null ? b.getCompetency().getName() : "";

            list.add(new StrengthDevelopmentDto(bId, b.getTitle(), compName, avgScore, self, top ? "STRENGTH" : "DEVELOPMENT_AREA"));
        }

        if (top) {
            list.sort((a, b) -> b.getScore().compareTo(a.getScore()));
        } else {
            list.sort((a, b) -> a.getScore().compareTo(b.getScore()));
        }

        return list.stream().limit(limit).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlindSpotHiddenStrengthDto> calculateBlindSpots(Long assignmentId) {
        List<CompetencySummary> summaries = summaryRepository.findByAssignmentIdOrderByCompetencyRankAsc(assignmentId);
        List<BlindSpotHiddenStrengthDto> list = new ArrayList<>();

        for (CompetencySummary s : summaries) {
            if (s.getGapScore() != null && s.getGapScore().doubleValue() >= blindSpotThreshold) {
                list.add(new BlindSpotHiddenStrengthDto(
                        s.getCompetency().getId(),
                        s.getCompetency().getName(),
                        s.getSelfScore(),
                        s.getOthersAverage(),
                        s.getGapScore(),
                        "BLIND_SPOT",
                        "Your self-evaluation is notably higher than others' perception. Seek specific feedback from colleagues to understand behavioural disconnects."
                ));
            }
        }
        return list;
    }

    @Transactional(readOnly = true)
    public List<BlindSpotHiddenStrengthDto> calculateHiddenStrengths(Long assignmentId) {
        List<CompetencySummary> summaries = summaryRepository.findByAssignmentIdOrderByCompetencyRankAsc(assignmentId);
        List<BlindSpotHiddenStrengthDto> list = new ArrayList<>();

        for (CompetencySummary s : summaries) {
            if (s.getGapScore() != null && s.getGapScore().doubleValue() <= hiddenStrengthThreshold) {
                list.add(new BlindSpotHiddenStrengthDto(
                        s.getCompetency().getId(),
                        s.getCompetency().getName(),
                        s.getSelfScore(),
                        s.getOthersAverage(),
                        s.getGapScore(),
                        "HIDDEN_STRENGTH",
                        "Colleagues recognize your strong performance in this area more than you credit yourself. Leverage this strength more visibly."
                ));
            }
        }
        return list;
    }
}
