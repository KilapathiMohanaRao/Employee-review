package com.employee360.controller;

import com.employee360.dto.*;
import com.employee360.entity.Employee;
import com.employee360.repository.EmployeeRepository;
import com.employee360.security.CustomUserDetails;
import com.employee360.service.DevelopmentPlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/development-plans")
public class DevelopmentPlanController {

    private final DevelopmentPlanService planService;
    private final EmployeeRepository employeeRepository;

    public DevelopmentPlanController(DevelopmentPlanService planService, EmployeeRepository employeeRepository) {
        this.planService = planService;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DevelopmentPlanDto>>> getMyPlans(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long employeeId) {

        Long empId = employeeId;
        if (empId == null && userDetails != null) {
            empId = employeeRepository.findByUserId(userDetails.getId())
                    .map(Employee::getId)
                    .orElse(null);
        }

        if (empId == null) {
            empId = 4L; // Default demo employee (Alex Taylor)
        }

        List<DevelopmentPlanDto> plans = planService.getEmployeePlans(empId);
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<DevelopmentPlanDto>>> getEmployeePlans(@PathVariable Long employeeId) {
        List<DevelopmentPlanDto> plans = planService.getEmployeePlans(employeeId);
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @GetMapping("/team/{managerId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<DevelopmentPlanDto>>> getTeamPlans(@PathVariable Long managerId) {
        List<DevelopmentPlanDto> plans = planService.getTeamPlans(managerId);
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DevelopmentPlanDto>> getPlanById(@PathVariable Long id) {
        DevelopmentPlanDto plan = planService.getPlanById(id);
        return ResponseEntity.ok(ApiResponse.success(plan));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DevelopmentPlanDto>> createPlan(@Valid @RequestBody CreateDevelopmentPlanRequest request) {
        DevelopmentPlanDto created = planService.createPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Development plan created successfully", created));
    }

    @PostMapping("/{id}/checkins")
    public ResponseEntity<ApiResponse<ProgressCheckinDto>> addCheckin(
            @PathVariable Long id,
            @Valid @RequestBody CreateCheckinRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long managerId = null;
        if (userDetails != null) {
            managerId = employeeRepository.findByUserId(userDetails.getId())
                    .map(Employee::getId)
                    .orElse(null);
        }

        ProgressCheckinDto checkin = planService.addCheckin(id, request, managerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Progress check-in recorded successfully", checkin));
    }
}
