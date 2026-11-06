package com.employee360.service;

import com.employee360.dto.*;
import com.employee360.entity.*;
import com.employee360.exception.AssessmentLockedException;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentAssignmentRepository assignmentRepository;
    private final ReviewerRelationshipRepository relationshipRepository;
    private final AssessmentResponseRepository responseRepository;
    private final BehaviourRepository behaviourRepository;
    private final EmployeeRepository employeeRepository;
    private final CalculationEngineService calculationEngineService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentAssignmentRepository assignmentRepository,
                             ReviewerRelationshipRepository relationshipRepository,
                             AssessmentResponseRepository responseRepository,
                             BehaviourRepository behaviourRepository,
                             EmployeeRepository employeeRepository,
                             CalculationEngineService calculationEngineService,
                             NotificationService notificationService,
                             AuditLogService auditLogService) {
        this.assessmentRepository = assessmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.relationshipRepository = relationshipRepository;
        this.responseRepository = responseRepository;
        this.behaviourRepository = behaviourRepository;
        this.employeeRepository = employeeRepository;
        this.calculationEngineService = calculationEngineService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<MyAssignmentDto> getMyAssignments(Long reviewerEmployeeId) {
        List<ReviewerRelationship> relationships = relationshipRepository.findAllMyReviews(reviewerEmployeeId);
        List<MyAssignmentDto> list = new ArrayList<>();

        for (ReviewerRelationship rel : relationships) {
            AssessmentAssignment assignment = rel.getAssignment();
            Employee evaluatee = assignment.getEmployee();

            Assessment assessment = assessmentRepository.findByReviewerRelationshipId(rel.getId()).orElse(null);

            MyAssignmentDto dto = new MyAssignmentDto();
            dto.setRelationshipId(rel.getId());
            dto.setAssignmentId(assignment.getId());
            dto.setReviewType(rel.getReviewType());
            dto.setAnonymous(rel.isAnonymous());
            dto.setStatus(rel.getStatus());
            dto.setEvaluateeEmployeeId(evaluatee.getId());
            dto.setEvaluateeName(evaluatee.getFullName());
            dto.setEvaluateeDepartment(evaluatee.getDepartment() != null ? evaluatee.getDepartment().getName() : "");
            dto.setEvaluateeDesignation(evaluatee.getDesignation() != null ? evaluatee.getDesignation().getTitle() : "");
            dto.setEvaluateeAvatarUrl(evaluatee.getAvatarUrl());
            dto.setCycleId(assignment.getCycle().getId());
            dto.setCycleTitle(assignment.getCycle().getTitle());
            dto.setDeadline(assignment.getCycle().getEndDate());

            if (assessment != null) {
                dto.setAssessmentId(assessment.getId());
                dto.setLocked(assessment.isLocked());
                dto.setSubmittedAt(assessment.getSubmittedAt());
            }

            list.add(dto);
        }
        return list;
    }

    @Transactional
    public AssessmentDetailDto getAssessmentDetails(Long relationshipId) {
        ReviewerRelationship rel = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer relationship not found: " + relationshipId));

        Assessment assessment = assessmentRepository.findByReviewerRelationshipId(relationshipId)
                .orElseGet(() -> {
                    Assessment newAssessment = new Assessment(rel.getAssignment(), rel);
                    newAssessment.setStatus("DRAFT");
                    return assessmentRepository.save(newAssessment);
                });

        AssessmentDetailDto dto = new AssessmentDetailDto();
        dto.setId(assessment.getId());
        dto.setAssignmentId(rel.getAssignment().getId());
        dto.setRelationshipId(rel.getId());
        dto.setReviewType(rel.getReviewType());
        dto.setAnonymous(rel.isAnonymous());
        dto.setStatus(assessment.getStatus());
        dto.setLocked(assessment.isLocked());

        Employee evaluatee = rel.getAssignment().getEmployee();
        dto.setEvaluateeEmployeeId(evaluatee.getId());
        dto.setEvaluateeName(evaluatee.getFullName());
        dto.setEvaluateeDepartment(evaluatee.getDepartment() != null ? evaluatee.getDepartment().getName() : "");
        dto.setEvaluateeDesignation(evaluatee.getDesignation() != null ? evaluatee.getDesignation().getTitle() : "");
        dto.setCycleTitle(rel.getAssignment().getCycle().getTitle());

        dto.setSubmittedAt(assessment.getSubmittedAt());

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN") || a.getAuthority().equals("ROLE_HR_ADMIN"));

        if (assessment.isLocked() && !isAdmin) {
            // Strict privacy requirement: Employees cannot retrieve or view submitted ratings or comments
            dto.setSummaryFeedback(null);
            dto.setKeyStrengthsComment(null);
            dto.setDevelopmentAreasComment(null);
            dto.setResponses(Collections.emptyList());
        } else {
            dto.setSummaryFeedback(assessment.getSummaryFeedback());
            dto.setKeyStrengthsComment(assessment.getKeyStrengthsComment());
            dto.setDevelopmentAreasComment(assessment.getDevelopmentAreasComment());

            List<AssessmentResponse> responses = responseRepository.findByAssessmentId(assessment.getId());
            dto.setResponses(responses.stream()
                    .map(r -> new ResponseItemDto(r.getBehaviour().getId(), r.getScore(), r.isNotObserved(), r.getComments()))
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    @Transactional
    public AssessmentDetailDto saveDraft(Long assessmentId, AssessmentDraftRequest req) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + assessmentId));

        if (assessment.isLocked()) {
            throw new AssessmentLockedException("Cannot modify a locked assessment.");
        }

        assessment.setSummaryFeedback(req.getSummaryFeedback());
        assessment.setKeyStrengthsComment(req.getKeyStrengthsComment());
        assessment.setDevelopmentAreasComment(req.getDevelopmentAreasComment());
        assessment.setStatus("DRAFT");

        saveOrUpdateResponses(assessment, req.getResponses());

        Assessment saved = assessmentRepository.save(assessment);

        ReviewerRelationship rel = saved.getReviewerRelationship();
        rel.setStatus("DRAFT");
        relationshipRepository.save(rel);

        return getAssessmentDetails(rel.getId());
    }

    @Transactional
    public AssessmentDetailDto submitAssessment(Long assessmentId, AssessmentSubmissionRequest req) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + assessmentId));

        if (assessment.isLocked()) {
            throw new AssessmentLockedException("Assessment is locked and already submitted.");
        }

        assessment.setSummaryFeedback(req.getSummaryFeedback());
        assessment.setKeyStrengthsComment(req.getKeyStrengthsComment());
        assessment.setDevelopmentAreasComment(req.getDevelopmentAreasComment());
        assessment.setStatus("SUBMITTED");
        assessment.setSubmittedAt(LocalDateTime.now());
        assessment.setLocked(true); // Lock upon submission

        saveOrUpdateResponses(assessment, req.getResponses());

        Assessment saved = assessmentRepository.save(assessment);

        ReviewerRelationship rel = saved.getReviewerRelationship();
        rel.setStatus("SUBMITTED");
        rel.setSubmittedAt(LocalDateTime.now());
        relationshipRepository.save(rel);

        // Recalculate 360 summary for the employee assignment
        calculationEngineService.calculateAssignmentSummaries(saved.getAssignment().getId());

        // Notify evaluatee or manager
        Employee evaluatee = saved.getAssignment().getEmployee();
        if (evaluatee.getUser() != null) {
            String reviewerTag = rel.isAnonymous() ? "A colleague" : rel.getReviewer().getFullName();
            notificationService.sendNotification(
                    evaluatee.getUser().getId(),
                    "ASSESSMENT_SUBMITTED",
                    "New Feedback Submitted",
                    reviewerTag + " submitted a " + rel.getReviewType().toLowerCase().replace('_', ' ') + " evaluation for you.",
                    "/reports/360"
            );
        }

        auditLogService.log(null, "SUBMIT_ASSESSMENT", "assessments", saved.getId(),
                "Submitted assessment for " + evaluatee.getFullName() + " (" + rel.getReviewType() + ")");

        return getAssessmentDetails(rel.getId());
    }

    @Transactional
    public void reopenAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + assessmentId));

        assessment.setLocked(false);
        assessment.setStatus("REOPENED");
        assessmentRepository.save(assessment);

        ReviewerRelationship rel = assessment.getReviewerRelationship();
        rel.setStatus("DRAFT");
        relationshipRepository.save(rel);

        auditLogService.log(null, "REOPEN_ASSESSMENT", "assessments", assessmentId, "HR authorized reopening of assessment");
    }

    @Transactional
    public ReviewerRelationship assignReviewer(Long assignmentId, AssignReviewerRequest req) {
        AssessmentAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

        Employee reviewer = employeeRepository.findById(req.getReviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found: " + req.getReviewerId()));

        Optional<ReviewerRelationship> existing = relationshipRepository.findByAssignmentIdAndReviewerIdAndReviewType(
                assignmentId, req.getReviewerId(), req.getReviewType());

        if (existing.isPresent()) {
            throw new BadRequestException("Reviewer already assigned with this review type");
        }

        boolean isAnon = req.getIsAnonymous() != null ? req.getIsAnonymous() :
                ("PEER".equalsIgnoreCase(req.getReviewType()) || "DIRECT_REPORT".equalsIgnoreCase(req.getReviewType()) || "CROSS_FUNCTIONAL".equalsIgnoreCase(req.getReviewType()));

        ReviewerRelationship rel = new ReviewerRelationship(assignment, reviewer, req.getReviewType(), isAnon);
        if (req.getWeight() != null) {
            rel.setWeight(req.getWeight());
        }
        ReviewerRelationship saved = relationshipRepository.save(rel);

        // Pre-create assessment instance
        Assessment assess = new Assessment(assignment, saved);
        assess.setStatus("DRAFT");
        assessmentRepository.save(assess);

        if (reviewer.getUser() != null) {
            notificationService.sendNotification(
                    reviewer.getUser().getId(),
                    "ASSESSMENT_ASSIGNED",
                    "Feedback Request Received",
                    "You have been requested to provide 360° feedback for " + assignment.getEmployee().getFullName() + " (" + req.getReviewType() + ")",
                    "/assessments"
            );
        }

        return saved;
    }

    private void saveOrUpdateResponses(Assessment assessment, List<ResponseItemDto> items) {
        if (items == null) return;

        for (ResponseItemDto item : items) {
            Behaviour b = behaviourRepository.findById(item.getBehaviourId()).orElse(null);
            if (b == null) continue;

            AssessmentResponse resp = responseRepository.findByAssessmentIdAndBehaviourId(assessment.getId(), b.getId())
                    .orElse(new AssessmentResponse(assessment, b, item.getScore(), item.isNotObserved(), item.getComments()));

            resp.setScore(item.getScore());
            resp.setNotObserved(item.isNotObserved());
            resp.setComments(item.getComments());
            responseRepository.save(resp);
        }
    }
}
