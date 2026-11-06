package com.employee360.service;

import com.employee360.dto.AssessmentCycleDto;
import com.employee360.dto.CreateCycleRequest;
import com.employee360.entity.AssessmentAssignment;
import com.employee360.entity.AssessmentCycle;
import com.employee360.entity.Employee;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.AssessmentAssignmentRepository;
import com.employee360.repository.AssessmentCycleRepository;
import com.employee360.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssessmentCycleService {

    private final AssessmentCycleRepository cycleRepository;
    private final AssessmentAssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AssessmentCycleService(AssessmentCycleRepository cycleRepository,
                                  AssessmentAssignmentRepository assignmentRepository,
                                  EmployeeRepository employeeRepository,
                                  NotificationService notificationService,
                                  AuditLogService auditLogService) {
        this.cycleRepository = cycleRepository;
        this.assignmentRepository = assignmentRepository;
        this.employeeRepository = employeeRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<AssessmentCycleDto> getAllCycles() {
        return cycleRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentCycleDto getCycleById(Long id) {
        return cycleRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found with id: " + id));
    }

    @Transactional
    public AssessmentCycleDto createCycle(CreateCycleRequest req) {
        if (cycleRepository.findByCode(req.getCode()).isPresent()) {
            throw new BadRequestException("Cycle code already exists: " + req.getCode());
        }

        AssessmentCycle cycle = new AssessmentCycle();
        cycle.setTitle(req.getTitle());
        cycle.setCode(req.getCode());
        cycle.setDescription(req.getDescription());
        cycle.setStartDate(req.getStartDate());
        cycle.setEndDate(req.getEndDate());
        cycle.setStatus("CREATED");
        cycle.setAnonymousPeerFeedback(req.isAnonymousPeerFeedback());
        cycle.setAnonymousDirectReportFeedback(req.isAnonymousDirectReportFeedback());
        cycle.setAnonymousCrossFunctional(req.isAnonymousCrossFunctional());

        if (req.getWeightSelf() != null) cycle.setWeightSelf(req.getWeightSelf());
        if (req.getWeightManager() != null) cycle.setWeightManager(req.getWeightManager());
        if (req.getWeightPeer() != null) cycle.setWeightPeer(req.getWeightPeer());
        if (req.getWeightDirectReport() != null) cycle.setWeightDirectReport(req.getWeightDirectReport());
        if (req.getWeightCrossFunctional() != null) cycle.setWeightCrossFunctional(req.getWeightCrossFunctional());

        AssessmentCycle saved = cycleRepository.save(cycle);

        // Assign employees if requested
        if (req.getEmployeeIds() != null && !req.getEmployeeIds().isEmpty()) {
            final AssessmentCycle cycleRef = saved;
            for (Long empId : req.getEmployeeIds()) {
                employeeRepository.findById(empId).ifPresent(emp -> {
                    AssessmentAssignment assignment = new AssessmentAssignment(cycleRef, emp);
                    assignmentRepository.save(assignment);
                });
            }
            saved.setStatus("CONFIGURED");
            saved = cycleRepository.save(saved);
        }

        auditLogService.log(null, "CREATE_CYCLE", "assessment_cycles", saved.getId(), "Created cycle: " + saved.getTitle());
        return toDto(saved);
    }

    @Transactional
    public AssessmentCycleDto launchCycle(Long id) {
        AssessmentCycle cycle = cycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found with id: " + id));

        cycle.setStatus("IN_PROGRESS");
        AssessmentCycle updated = cycleRepository.save(cycle);

        // Notify assigned employees
        List<AssessmentAssignment> assignments = assignmentRepository.findByCycleId(id);
        for (AssessmentAssignment a : assignments) {
            a.setStatus("IN_PROGRESS");
            assignmentRepository.save(a);

            if (a.getEmployee().getUser() != null) {
                notificationService.sendNotification(
                        a.getEmployee().getUser().getId(),
                        "ASSESSMENT_ASSIGNED",
                        "New 360° Assessment Cycle Launched",
                        "Assessment cycle '" + cycle.getTitle() + "' has commenced. Complete your self-assessment by " + cycle.getEndDate(),
                        "/assessments"
                );
            }
        }

        auditLogService.log(null, "LAUNCH_CYCLE", "assessment_cycles", id, "Launched cycle: " + cycle.getTitle());
        return toDto(updated);
    }

    @Transactional
    public AssessmentCycleDto closeCycle(Long id) {
        AssessmentCycle cycle = cycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found with id: " + id));

        cycle.setStatus("CLOSED");
        AssessmentCycle updated = cycleRepository.save(cycle);

        auditLogService.log(null, "CLOSE_CYCLE", "assessment_cycles", id, "Closed cycle: " + cycle.getTitle());
        return toDto(updated);
    }

    @Transactional
    public AssessmentCycleDto publishCycle(Long id) {
        AssessmentCycle cycle = cycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found with id: " + id));

        cycle.setStatus("PUBLISHED");
        AssessmentCycle updated = cycleRepository.save(cycle);

        List<AssessmentAssignment> assignments = assignmentRepository.findByCycleId(id);
        for (AssessmentAssignment a : assignments) {
            a.setStatus("PUBLISHED");
            a.setPublishedAt(java.time.LocalDateTime.now());
            assignmentRepository.save(a);

            if (a.getEmployee().getUser() != null) {
                notificationService.sendNotification(
                        a.getEmployee().getUser().getId(),
                        "CYCLE_PUBLISHED",
                        "360° Assessment Results Published",
                        "Your performance report for '" + cycle.getTitle() + "' is now available. Review your feedback scorecard and initiate your IDP.",
                        "/reports/360"
                );
            }
        }

        auditLogService.log(null, "PUBLISH_CYCLE", "assessment_cycles", id, "Published cycle: " + cycle.getTitle());
        return toDto(updated);
    }

    private AssessmentCycleDto toDto(AssessmentCycle c) {
        AssessmentCycleDto dto = new AssessmentCycleDto();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setCode(c.getCode());
        dto.setDescription(c.getDescription());
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());
        dto.setStatus(c.getStatus());
        dto.setAnonymousPeerFeedback(c.isAnonymousPeerFeedback());
        dto.setAnonymousDirectReportFeedback(c.isAnonymousDirectReportFeedback());
        dto.setAnonymousCrossFunctional(c.isAnonymousCrossFunctional());
        dto.setWeightSelf(c.getWeightSelf());
        dto.setWeightManager(c.getWeightManager());
        dto.setWeightPeer(c.getWeightPeer());
        dto.setWeightDirectReport(c.getWeightDirectReport());
        dto.setWeightCrossFunctional(c.getWeightCrossFunctional());
        dto.setCreatedAt(c.getCreatedAt());

        List<AssessmentAssignment> assigns = assignmentRepository.findByCycleId(c.getId());
        dto.setTotalEmployees(assigns.size());

        long completed = assigns.stream()
                .filter(a -> "COMPLETED".equals(a.getStatus()) || "PUBLISHED".equals(a.getStatus()))
                .count();
        dto.setCompletedAssessments((int) completed);

        if (!assigns.isEmpty()) {
            dto.setCompletionPercentage(Math.round(((double) completed / assigns.size()) * 100.0));
        } else {
            dto.setCompletionPercentage(0.0);
        }

        return dto;
    }
}
