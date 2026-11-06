package com.employee360.service;

import com.employee360.dto.*;
import com.employee360.entity.*;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DevelopmentPlanService {

    private final DevelopmentPlanRepository planRepository;
    private final DevelopmentActionRepository actionRepository;
    private final ProgressCheckinRepository checkinRepository;
    private final EmployeeRepository employeeRepository;
    private final CompetencyRepository competencyRepository;
    private final AssessmentAssignmentRepository assignmentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public DevelopmentPlanService(DevelopmentPlanRepository planRepository,
                                  DevelopmentActionRepository actionRepository,
                                  ProgressCheckinRepository checkinRepository,
                                  EmployeeRepository employeeRepository,
                                  CompetencyRepository competencyRepository,
                                  AssessmentAssignmentRepository assignmentRepository,
                                  NotificationService notificationService,
                                  AuditLogService auditLogService) {
        this.planRepository = planRepository;
        this.actionRepository = actionRepository;
        this.checkinRepository = checkinRepository;
        this.employeeRepository = employeeRepository;
        this.competencyRepository = competencyRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<DevelopmentPlanDto> getEmployeePlans(Long employeeId) {
        return planRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DevelopmentPlanDto> getTeamPlans(Long managerId) {
        return planRepository.findTeamDevelopmentPlans(managerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DevelopmentPlanDto getPlanById(Long id) {
        return planRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Development plan not found with id: " + id));
    }

    @Transactional
    public DevelopmentPlanDto createPlan(CreateDevelopmentPlanRequest req) {
        Employee emp = employeeRepository.findById(req.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + req.getEmployeeId()));

        Competency comp = competencyRepository.findById(req.getFocusCompetencyId())
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found: " + req.getFocusCompetencyId()));

        DevelopmentPlan plan = new DevelopmentPlan();
        plan.setEmployee(emp);
        plan.setFocusCompetency(comp);
        plan.setInsightSummary(req.getInsightSummary());
        plan.setFeedbackEvidence(req.getFeedbackEvidence());
        plan.setSmartGoal(req.getSmartGoal());
        plan.setMentorOrSupport(req.getMentorOrSupport());
        plan.setSuccessMeasurement(req.getSuccessMeasurement());
        plan.setTargetDate(req.getTargetDate());
        plan.setStatus("ACTIVE");
        plan.setOverallProgress(0);

        if (req.getAssignmentId() != null) {
            assignmentRepository.findById(req.getAssignmentId()).ifPresent(plan::setAssignment);
        }

        if (req.getActions() != null) {
            for (DevelopmentActionDto aDto : req.getActions()) {
                DevelopmentAction action = new DevelopmentAction(
                        aDto.getFrameworkType(),
                        aDto.getActionTitle(),
                        aDto.getActionDescription(),
                        aDto.getTargetCompletionDate()
                );
                action.setStatus("NOT_STARTED");
                action.setProgress(0);
                plan.addAction(action);
            }
        }

        DevelopmentPlan saved = planRepository.save(plan);

        // Notify manager
        if (emp.getManager() != null && emp.getManager().getUser() != null) {
            notificationService.sendNotification(
                    emp.getManager().getUser().getId(),
                    "DEVELOPMENT_PLAN_CREATED",
                    "New IDP Created by Team Member",
                    emp.getFullName() + " created an Individual Development Plan focusing on '" + comp.getName() + "'",
                    "/development-plans"
            );
        }

        auditLogService.log(null, "CREATE_IDP", "development_plans", saved.getId(), "Created IDP for " + emp.getFullName());
        return toDto(saved);
    }

    @Transactional
    public ProgressCheckinDto addCheckin(Long planId, CreateCheckinRequest req, Long managerId) {
        DevelopmentPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Development plan not found: " + planId));

        ProgressCheckin checkin = new ProgressCheckin();
        checkin.setDevelopmentPlan(plan);
        checkin.setCheckinDate(req.getCheckinDate());
        checkin.setCheckinType(req.getCheckinType() != null ? req.getCheckinType() : "FOUR_WEEK");
        checkin.setEmployeeNotes(req.getEmployeeNotes());
        checkin.setManagerFeedback(req.getManagerFeedback());
        checkin.setProgressPercentage(req.getProgressPercentage());
        checkin.setStatusAssessment(req.getStatusAssessment() != null ? req.getStatusAssessment() : "ON_TRACK");

        if (managerId != null) {
            employeeRepository.findById(managerId).ifPresent(checkin::setConductedByManager);
        }

        if (req.getProgressPercentage() != null) {
            plan.setOverallProgress(req.getProgressPercentage());
            if (req.getProgressPercentage() >= 100) {
                plan.setStatus("COMPLETED");
            }
            planRepository.save(plan);
        }

        ProgressCheckin saved = checkinRepository.save(checkin);

        // Notify employee
        if (plan.getEmployee().getUser() != null) {
            notificationService.sendNotification(
                    plan.getEmployee().getUser().getId(),
                    "PROGRESS_CHECKIN_DUE",
                    "Development Check-in Completed",
                    "Your manager reviewed your development plan progress for " + plan.getFocusCompetency().getName(),
                    "/development-plans"
            );
        }

        auditLogService.log(null, "ADD_CHECKIN", "progress_checkins", saved.getId(),
                "Added checkin for plan #" + planId + " (" + saved.getStatusAssessment() + ")");

        return toCheckinDto(saved);
    }

    public DevelopmentPlanDto toDto(DevelopmentPlan p) {
        DevelopmentPlanDto dto = new DevelopmentPlanDto();
        dto.setId(p.getId());
        dto.setEmployeeId(p.getEmployee().getId());
        dto.setEmployeeName(p.getEmployee().getFullName());
        dto.setFocusCompetencyId(p.getFocusCompetency().getId());
        dto.setFocusCompetencyName(p.getFocusCompetency().getName());
        dto.setFocusCompetencyCategory(p.getFocusCompetency().getCategory());
        dto.setOthersAverage(p.getOthersAverage());
        dto.setSelfVsOthersGap(p.getSelfVsOthersGap());
        dto.setInsightSummary(p.getInsightSummary());
        dto.setFeedbackEvidence(p.getFeedbackEvidence());
        dto.setSmartGoal(p.getSmartGoal());
        dto.setMentorOrSupport(p.getMentorOrSupport());
        dto.setSuccessMeasurement(p.getSuccessMeasurement());
        dto.setTargetDate(p.getTargetDate());
        dto.setOverallProgress(p.getOverallProgress());
        dto.setStatus(p.getStatus());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());

        if (p.getAssignment() != null) {
            dto.setAssignmentId(p.getAssignment().getId());
        }

        List<DevelopmentAction> actions = actionRepository.findByDevelopmentPlanId(p.getId());
        dto.setActions(actions.stream().map(a -> {
            DevelopmentActionDto aDto = new DevelopmentActionDto();
            aDto.setId(a.getId());
            aDto.setDevelopmentPlanId(p.getId());
            aDto.setFrameworkType(a.getFrameworkType());
            aDto.setActionTitle(a.getActionTitle());
            aDto.setActionDescription(a.getActionDescription());
            aDto.setTargetCompletionDate(a.getTargetCompletionDate());
            aDto.setProgress(a.getProgress());
            aDto.setStatus(a.getStatus());
            return aDto;
        }).collect(Collectors.toList()));

        List<ProgressCheckin> checkins = checkinRepository.findByDevelopmentPlanIdOrderByCheckinDateDesc(p.getId());
        dto.setCheckins(checkins.stream().map(this::toCheckinDto).collect(Collectors.toList()));

        return dto;
    }

    public ProgressCheckinDto toCheckinDto(ProgressCheckin c) {
        ProgressCheckinDto dto = new ProgressCheckinDto();
        dto.setId(c.getId());
        dto.setDevelopmentPlanId(c.getDevelopmentPlan().getId());
        dto.setCheckinDate(c.getCheckinDate());
        dto.setCheckinType(c.getCheckinType());
        dto.setEmployeeNotes(c.getEmployeeNotes());
        dto.setManagerFeedback(c.getManagerFeedback());
        dto.setProgressPercentage(c.getProgressPercentage());
        dto.setStatusAssessment(c.getStatusAssessment());
        dto.setCreatedAt(c.getCreatedAt());

        if (c.getConductedByManager() != null) {
            dto.setConductedByManagerId(c.getConductedByManager().getId());
            dto.setConductedByManagerName(c.getConductedByManager().getFullName());
        }
        return dto;
    }
}
