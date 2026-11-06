package com.employee360.service;

import com.employee360.dto.*;
import com.employee360.entity.*;
import com.employee360.exception.AssessmentLockedException;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PrivateReviewService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentAssignmentRepository assignmentRepository;
    private final ReviewerRelationshipRepository relationshipRepository;
    private final AssessmentResponseRepository responseRepository;
    private final EmployeeRepository employeeRepository;
    private final AssessmentCycleRepository cycleRepository;
    private final CompetencyRepository competencyRepository;
    private final BehaviourRepository behaviourRepository;
    private final CalculationEngineService calculationEngineService;
    private final AuditLogService auditLogService;

    public PrivateReviewService(AssessmentRepository assessmentRepository,
                                AssessmentAssignmentRepository assignmentRepository,
                                ReviewerRelationshipRepository relationshipRepository,
                                AssessmentResponseRepository responseRepository,
                                EmployeeRepository employeeRepository,
                                AssessmentCycleRepository cycleRepository,
                                CompetencyRepository competencyRepository,
                                BehaviourRepository behaviourRepository,
                                CalculationEngineService calculationEngineService,
                                AuditLogService auditLogService) {
        this.assessmentRepository = assessmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.relationshipRepository = relationshipRepository;
        this.responseRepository = responseRepository;
        this.employeeRepository = employeeRepository;
        this.cycleRepository = cycleRepository;
        this.competencyRepository = competencyRepository;
        this.behaviourRepository = behaviourRepository;
        this.calculationEngineService = calculationEngineService;
        this.auditLogService = auditLogService;
    }

    /**
     * Submit an employee review securely.
     * Enforces duplicate submission prevention, data validation, and strict privacy.
     * Returns ONLY a confirmation signal - NEVER returning submitted ratings or comments.
     */
    @Transactional
    public void submitPrivateReview(PublicReviewSubmissionRequest req) {
        if (req.getEvaluateeEmployeeId() == null) {
            throw new BadRequestException("Evaluatee employee ID is required.");
        }

        Employee evaluatee = employeeRepository.findById(req.getEvaluateeEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluatee not found: " + req.getEvaluateeEmployeeId()));

        // Resolve Reviewer
        Employee reviewer = null;
        if (req.getReviewerEmployeeId() != null) {
            reviewer = employeeRepository.findById(req.getReviewerEmployeeId()).orElse(null);
        } else if (req.getReviewerEmail() != null && !req.getReviewerEmail().trim().isEmpty()) {
            reviewer = employeeRepository.findByEmail(req.getReviewerEmail().trim()).orElse(null);
        }

        if (reviewer == null) {
            // Default to an active peer/reviewer or David Kim (EMP-005)
            List<Employee> allEmployees = employeeRepository.findAll();
            reviewer = allEmployees.stream()
                    .filter(e -> !e.getId().equals(evaluatee.getId()))
                    .findFirst()
                    .orElse(evaluatee);
        }

        // Resolve Assessment Cycle
        AssessmentCycle cycle = null;
        if (req.getCycleId() != null) {
            cycle = cycleRepository.findById(req.getCycleId()).orElse(null);
        }
        if (cycle == null) {
            List<AssessmentCycle> inProgress = cycleRepository.findByStatus("IN_PROGRESS");
            cycle = !inProgress.isEmpty() ? inProgress.get(0) : cycleRepository.findAll().get(0);
        }

        // --- ENFORCE STRICT DUPLICATE PREVENTION ---
        List<Assessment> existingSubmitted = assessmentRepository.findSubmittedByReviewerAndEvaluateeAndCycle(
                reviewer.getId(), evaluatee.getId(), cycle.getId());
        if (!existingSubmitted.isEmpty()) {
            throw new BadRequestException("You have already submitted a review for " + evaluatee.getFullName() + ". Duplicate reviews are prohibited.");
        }

        // Validate Rating Scores (1 to 5)
        if (req.getCategoryRatings() == null || req.getCategoryRatings().isEmpty()) {
            throw new BadRequestException("At least one competency rating is required.");
        }

        for (CategoryRatingItemDto item : req.getCategoryRatings()) {
            if (item.getScore() != null && (item.getScore() < 1 || item.getScore() > 5)) {
                throw new BadRequestException("Rating score must be an integer between 1 and 5.");
            }
        }

        // Find or create AssessmentAssignment for evaluatee
        AssessmentCycle finalCycle = cycle;
        Employee finalEvaluatee = evaluatee;
        AssessmentAssignment assignment = assignmentRepository.findByEmployeeId(evaluatee.getId()).stream()
                .filter(a -> a.getCycle().getId().equals(finalCycle.getId()))
                .findFirst()
                .orElseGet(() -> {
                    AssessmentAssignment newAssign = new AssessmentAssignment(finalCycle, finalEvaluatee);
                    newAssign.setStatus("IN_PROGRESS");
                    return assignmentRepository.save(newAssign);
                });

        // Find or create ReviewerRelationship
        String reviewType = req.getReviewType() != null ? req.getReviewType().toUpperCase() : "PEER";
        Employee finalReviewer = reviewer;
        ReviewerRelationship relationship = relationshipRepository.findByAssignmentId(assignment.getId()).stream()
                .filter(r -> r.getReviewer().getId().equals(finalReviewer.getId()))
                .findFirst()
                .orElseGet(() -> {
                    ReviewerRelationship newRel = new ReviewerRelationship(assignment, finalReviewer, reviewType, req.isAnonymous());
                    return relationshipRepository.save(newRel);
                });

        // Find or create Assessment
        Assessment assessment = assessmentRepository.findByReviewerRelationshipId(relationship.getId())
                .orElseGet(() -> {
                    Assessment a = new Assessment(assignment, relationship);
                    return assessmentRepository.save(a);
                });

        if (assessment.isLocked()) {
            throw new AssessmentLockedException("This assessment has already been locked.");
        }

        // Set comments & feedback
        assessment.setSummaryFeedback(req.getSummaryFeedback());
        assessment.setKeyStrengthsComment(req.getKeyStrengthsComment());
        assessment.setDevelopmentAreasComment(req.getDevelopmentAreasComment());
        assessment.setStatus("SUBMITTED");
        assessment.setLocked(true); // Lock immediately for employee privacy
        assessment.setSubmittedAt(LocalDateTime.now());

        // Clear existing responses and save new ratings
        responseRepository.deleteByAssessmentId(assessment.getId());

        List<Competency> competencies = competencyRepository.findByActiveTrueOrderBySortOrderAsc();

        for (CategoryRatingItemDto catRating : req.getCategoryRatings()) {
            if (catRating.getScore() == null) continue;

            Competency comp = null;
            if (catRating.getCompetencyId() != null) {
                comp = competencyRepository.findById(catRating.getCompetencyId()).orElse(null);
            }
            if (comp == null && catRating.getCompetencyCode() != null) {
                comp = competencies.stream().filter(c -> c.getCode().equalsIgnoreCase(catRating.getCompetencyCode())).findFirst().orElse(null);
            }
            if (comp == null) {
                comp = competencies.get(0);
            }

            // Find first Behaviour for this competency
            Behaviour behaviour = null;
            if (comp.getBehaviours() != null && !comp.getBehaviours().isEmpty()) {
                behaviour = comp.getBehaviours().get(0);
            } else {
                List<Behaviour> behaviours = behaviourRepository.findAll();
                Competency finalComp = comp;
                behaviour = behaviours.stream().filter(b -> b.getCompetency().getId().equals(finalComp.getId())).findFirst().orElse(behaviours.get(0));
            }

            AssessmentResponse resp = new AssessmentResponse(assessment, behaviour, catRating.getScore(), false, catRating.getComments());
            responseRepository.save(resp);
        }

        assessmentRepository.save(assessment);

        relationship.setStatus("SUBMITTED");
        relationship.setSubmittedAt(LocalDateTime.now());
        relationshipRepository.save(relationship);

        // Recalculate 360 summary for evaluatee
        try {
            calculationEngineService.calculateAssignmentSummaries(assignment.getId());
        } catch (Exception e) {
            // Non-blocking calculation
        }

        auditLogService.log(null, "SUBMIT_PRIVATE_REVIEW", "assessments", assessment.getId(),
                "Private review submitted for " + evaluatee.getFullName() + " by " + reviewer.getFullName());
    }

    /**
     * Public/Employee endpoint to load available evaluatees and rating dimensions.
     * Contains NO submitted reviews or ratings.
     */
    @Transactional(readOnly = true)
    public ReviewFormDataDto getReviewFormData(Long evaluateeId) {
        List<Employee> employees = employeeRepository.findByStatus("ACTIVE");
        if (employees.isEmpty()) employees = employeeRepository.findAll();

        List<EmployeeDto> empDtos = employees.stream().map(e -> {
            EmployeeDto dto = new EmployeeDto();
            dto.setId(e.getId());
            dto.setFullName(e.getFullName());
            dto.setEmployeeCode(e.getEmployeeCode());
            dto.setEmail(e.getEmail());
            dto.setDepartmentName(e.getDepartment() != null ? e.getDepartment().getName() : "General");
            dto.setDesignationTitle(e.getDesignation() != null ? e.getDesignation().getTitle() : "Staff");
            dto.setAvatarUrl(e.getAvatarUrl());
            return dto;
        }).collect(Collectors.toList());

        List<Competency> competencies = competencyRepository.findByActiveTrueOrderBySortOrderAsc();
        List<CompetencyDto> compDtos = competencies.stream().map(c -> {
            CompetencyDto dto = new CompetencyDto();
            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setCode(c.getCode());
            dto.setCategory(c.getCategory());
            dto.setDescription(c.getDescription());
            return dto;
        }).collect(Collectors.toList());

        List<AssessmentCycle> inProgress = cycleRepository.findByStatus("IN_PROGRESS");
        AssessmentCycle cycle = !inProgress.isEmpty() ? inProgress.get(0) : cycleRepository.findAll().get(0);
        AssessmentCycleDto cycleDto = new AssessmentCycleDto();
        cycleDto.setId(cycle.getId());
        cycleDto.setTitle(cycle.getTitle());
        cycleDto.setCode(cycle.getCode());
        cycleDto.setDescription(cycle.getDescription());

        return new ReviewFormDataDto(empDtos, compDtos, cycleDto);
    }

    /**
     * ADMIN-ONLY: View all submitted employee reviews with full privacy enforcement.
     */
    @Transactional(readOnly = true)
    public List<AdminReviewDto> getAllSubmittedReviews(String search, String department, Integer minRating, Integer maxRating) {
        List<Assessment> assessments = assessmentRepository.findAllSubmittedAssessments();
        List<AdminReviewDto> list = new ArrayList<>();

        for (Assessment a : assessments) {
            ReviewerRelationship rel = a.getReviewerRelationship();
            AssessmentAssignment assignment = a.getAssignment();
            Employee evaluatee = assignment.getEmployee();
            Employee reviewer = rel != null ? rel.getReviewer() : null;

            AdminReviewDto dto = new AdminReviewDto();
            dto.setReviewId(a.getId());

            // Evaluatee
            dto.setEvaluateeId(evaluatee.getId());
            dto.setEvaluateeName(evaluatee.getFullName());
            dto.setEvaluateeCode(evaluatee.getEmployeeCode());
            dto.setEvaluateeDepartment(evaluatee.getDepartment() != null ? evaluatee.getDepartment().getName() : "General");
            dto.setEvaluateeDesignation(evaluatee.getDesignation() != null ? evaluatee.getDesignation().getTitle() : "Staff");
            dto.setEvaluateeAvatar(evaluatee.getAvatarUrl());

            // Reviewer
            if (reviewer != null) {
                dto.setReviewerId(reviewer.getId());
                dto.setReviewerName(reviewer.getFullName());
                dto.setReviewerCode(reviewer.getEmployeeCode());
                dto.setReviewerDepartment(reviewer.getDepartment() != null ? reviewer.getDepartment().getName() : "General");
                dto.setReviewerDesignation(reviewer.getDesignation() != null ? reviewer.getDesignation().getTitle() : "Staff");
            }
            dto.setReviewType(rel != null ? rel.getReviewType() : "PEER");
            dto.setAnonymous(rel != null && rel.isAnonymous());

            // Feedback & Comments
            dto.setSummaryFeedback(a.getSummaryFeedback());
            dto.setKeyStrengthsComment(a.getKeyStrengthsComment());
            dto.setDevelopmentAreasComment(a.getDevelopmentAreasComment());
            dto.setStatus(a.getStatus());
            dto.setLocked(a.isLocked());
            dto.setSubmittedAt(a.getSubmittedAt());
            dto.setCycleTitle(assignment.getCycle() != null ? assignment.getCycle().getTitle() : "Annual Review");

            // Responses / Ratings
            List<AssessmentResponse> responses = responseRepository.findByAssessmentId(a.getId());
            List<CategoryRatingItemDto> catRatings = new ArrayList<>();
            double scoreSum = 0;
            int scoreCount = 0;

            for (AssessmentResponse r : responses) {
                if (r.getScore() != null) {
                    Competency comp = r.getBehaviour().getCompetency();
                    catRatings.add(new CategoryRatingItemDto(
                            comp.getId(),
                            comp.getName(),
                            comp.getCode(),
                            comp.getCategory(),
                            r.getScore(),
                            r.getComments()
                    ));
                    scoreSum += r.getScore();
                    scoreCount++;
                }
            }

            dto.setCategoryRatings(catRatings);
            BigDecimal avg = scoreCount > 0 ? BigDecimal.valueOf(scoreSum / scoreCount).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            dto.setOverallRating(avg);

            // Apply Filters
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matchName = dto.getEvaluateeName().toLowerCase().contains(q);
                boolean matchCode = dto.getEvaluateeCode().toLowerCase().contains(q);
                boolean matchReviewer = dto.getReviewerName() != null && dto.getReviewerName().toLowerCase().contains(q);
                if (!matchName && !matchCode && !matchReviewer) continue;
            }

            if (department != null && !department.trim().isEmpty() && !"ALL".equalsIgnoreCase(department)) {
                if (!department.equalsIgnoreCase(dto.getEvaluateeDepartment())) continue;
            }

            if (minRating != null && avg.doubleValue() < minRating) continue;
            if (maxRating != null && avg.doubleValue() > maxRating) continue;

            list.add(dto);
        }

        return list;
    }

    /**
     * ADMIN-ONLY: Get executive review summary metrics.
     */
    @Transactional(readOnly = true)
    public AdminReviewSummaryDto getAdminReviewSummary() {
        List<AdminReviewDto> all = getAllSubmittedReviews(null, null, null, null);

        AdminReviewSummaryDto summary = new AdminReviewSummaryDto();
        summary.setTotalSubmittedReviews(all.size());

        if (!all.isEmpty()) {
            double totalScore = all.stream().mapToDouble(r -> r.getOverallRating().doubleValue()).average().orElse(0.0);
            summary.setOverallAverageRating(BigDecimal.valueOf(totalScore).setScale(2, RoundingMode.HALF_UP));

            Set<Long> evalIds = all.stream().map(AdminReviewDto::getEvaluateeId).collect(Collectors.toSet());
            summary.setTotalEvaluatees(evalIds.size());

            Set<Long> revIds = all.stream().map(AdminReviewDto::getReviewerId).filter(Objects::nonNull).collect(Collectors.toSet());
            summary.setTotalReviewers(revIds.size());

            // Department breakdown
            Map<String, Long> deptMap = all.stream()
                    .collect(Collectors.groupingBy(AdminReviewDto::getEvaluateeDepartment, Collectors.counting()));
            summary.setDepartmentBreakdown(deptMap);

            // Category averages
            Map<String, List<Integer>> compScores = new HashMap<>();
            for (AdminReviewDto r : all) {
                for (CategoryRatingItemDto cat : r.getCategoryRatings()) {
                    compScores.computeIfAbsent(cat.getCompetencyName(), k -> new ArrayList<>()).add(cat.getScore());
                }
            }
            Map<String, BigDecimal> catAvgs = new LinkedHashMap<>();
            for (Map.Entry<String, List<Integer>> entry : compScores.entrySet()) {
                double avg = entry.getValue().stream().mapToInt(Integer::intValue).average().orElse(0.0);
                catAvgs.put(entry.getKey(), BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            }
            summary.setCategoryAverages(catAvgs);

            summary.setRecentReviews(all.stream().limit(10).collect(Collectors.toList()));
        } else {
            summary.setOverallAverageRating(BigDecimal.ZERO);
            summary.setTotalEvaluatees(0);
            summary.setTotalReviewers(0);
            summary.setDepartmentBreakdown(Collections.emptyMap());
            summary.setCategoryAverages(Collections.emptyMap());
            summary.setRecentReviews(Collections.emptyList());
        }

        return summary;
    }

    /**
     * ADMIN-ONLY: Get single review detail.
     */
    @Transactional(readOnly = true)
    public AdminReviewDto getReviewById(Long reviewId) {
        List<AdminReviewDto> all = getAllSubmittedReviews(null, null, null, null);
        return all.stream()
                .filter(r -> r.getReviewId().equals(reviewId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
    }
}
