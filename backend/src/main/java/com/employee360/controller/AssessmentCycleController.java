package com.employee360.controller;

import com.employee360.dto.ApiResponse;
import com.employee360.dto.AssessmentCycleDto;
import com.employee360.dto.CreateCycleRequest;
import com.employee360.service.AssessmentCycleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment-cycles")
public class AssessmentCycleController {

    private final AssessmentCycleService cycleService;

    public AssessmentCycleController(AssessmentCycleService cycleService) {
        this.cycleService = cycleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssessmentCycleDto>>> getAllCycles() {
        return ResponseEntity.ok(ApiResponse.success(cycleService.getAllCycles()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentCycleDto>> getCycleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(cycleService.getCycleById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<AssessmentCycleDto>> createCycle(@Valid @RequestBody CreateCycleRequest request) {
        AssessmentCycleDto created = cycleService.createCycle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Assessment cycle created successfully", created));
    }

    @PostMapping("/{id}/launch")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<AssessmentCycleDto>> launchCycle(@PathVariable Long id) {
        AssessmentCycleDto launched = cycleService.launchCycle(id);
        return ResponseEntity.ok(ApiResponse.success("Assessment cycle launched successfully", launched));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<AssessmentCycleDto>> closeCycle(@PathVariable Long id) {
        AssessmentCycleDto closed = cycleService.closeCycle(id);
        return ResponseEntity.ok(ApiResponse.success("Assessment cycle closed successfully", closed));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<AssessmentCycleDto>> publishCycle(@PathVariable Long id) {
        AssessmentCycleDto published = cycleService.publishCycle(id);
        return ResponseEntity.ok(ApiResponse.success("Assessment cycle published and feedback released", published));
    }
}
