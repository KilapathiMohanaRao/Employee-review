package com.employee360.controller;

import com.employee360.dto.*;
import com.employee360.entity.Employee;
import com.employee360.entity.ReviewerRelationship;
import com.employee360.entity.User;
import com.employee360.repository.EmployeeRepository;
import com.employee360.repository.UserRepository;
import com.employee360.security.CustomUserDetails;
import com.employee360.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public AssessmentController(AssessmentService assessmentService,
                                EmployeeRepository employeeRepository,
                                UserRepository userRepository) {
        this.assessmentService = assessmentService;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/my-assignments")
    public ResponseEntity<ApiResponse<List<MyAssignmentDto>>> getMyAssignments(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long reviewerEmployeeId) {

        Long empId = reviewerEmployeeId;
        if (empId == null && userDetails != null) {
            empId = employeeRepository.findByUserId(userDetails.getId())
                    .map(Employee::getId)
                    .orElse(null);
        }

        if (empId == null) {
            // Default demo reviewer fallback
            empId = 4L;
        }

        List<MyAssignmentDto> list = assessmentService.getMyAssignments(empId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/relationship/{relationshipId}")
    public ResponseEntity<ApiResponse<AssessmentDetailDto>> getAssessmentByRelationship(@PathVariable Long relationshipId) {
        AssessmentDetailDto detail = assessmentService.getAssessmentDetails(relationshipId);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @PostMapping("/{id}/draft")
    public ResponseEntity<ApiResponse<AssessmentDetailDto>> saveDraft(
            @PathVariable Long id,
            @RequestBody AssessmentDraftRequest request) {
        AssessmentDetailDto updated = assessmentService.saveDraft(id, request);
        return ResponseEntity.ok(ApiResponse.success("Assessment draft saved successfully", updated));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<AssessmentDetailDto>> submitAssessment(
            @PathVariable Long id,
            @Valid @RequestBody AssessmentSubmissionRequest request) {
        AssessmentDetailDto submitted = assessmentService.submitAssessment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Assessment submitted successfully and locked", submitted));
    }

    @PostMapping("/{id}/reopen")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> reopenAssessment(@PathVariable Long id) {
        assessmentService.reopenAssessment(id);
        return ResponseEntity.ok(ApiResponse.success("Assessment reopened by HR authorization", null));
    }

    @PostMapping("/assignments/{assignmentId}/reviewers")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ReviewerRelationship>> assignReviewer(
            @PathVariable Long assignmentId,
            @Valid @RequestBody AssignReviewerRequest request) {
        ReviewerRelationship rel = assessmentService.assignReviewer(assignmentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Reviewer assigned successfully", rel));
    }
}
