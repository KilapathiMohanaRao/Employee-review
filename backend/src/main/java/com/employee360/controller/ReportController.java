package com.employee360.controller;

import com.employee360.dto.*;
import com.employee360.service.CalculationEngineService;
import com.employee360.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final CalculationEngineService calculationEngineService;

    public ReportController(ReportService reportService, CalculationEngineService calculationEngineService) {
        this.reportService = reportService;
        this.calculationEngineService = calculationEngineService;
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<Employee360ReportDto>> getEmployee360Report(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Long cycleId) {
        Employee360ReportDto report = reportService.getEmployee360Report(employeeId, cycleId);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/assignment/{assignmentId}/strengths")
    public ResponseEntity<ApiResponse<List<StrengthDevelopmentDto>>> getTopStrengths(@PathVariable Long assignmentId) {
        List<StrengthDevelopmentDto> strengths = calculationEngineService.calculateTopStrengths(assignmentId);
        return ResponseEntity.ok(ApiResponse.success(strengths));
    }

    @GetMapping("/assignment/{assignmentId}/development-areas")
    public ResponseEntity<ApiResponse<List<StrengthDevelopmentDto>>> getTopDevelopmentAreas(@PathVariable Long assignmentId) {
        List<StrengthDevelopmentDto> devAreas = calculationEngineService.calculateTopDevelopmentAreas(assignmentId);
        return ResponseEntity.ok(ApiResponse.success(devAreas));
    }

    @GetMapping("/assignment/{assignmentId}/blind-spots")
    public ResponseEntity<ApiResponse<List<BlindSpotHiddenStrengthDto>>> getBlindSpots(@PathVariable Long assignmentId) {
        List<BlindSpotHiddenStrengthDto> blindSpots = calculationEngineService.calculateBlindSpots(assignmentId);
        return ResponseEntity.ok(ApiResponse.success(blindSpots));
    }

    @GetMapping("/assignment/{assignmentId}/hidden-strengths")
    public ResponseEntity<ApiResponse<List<BlindSpotHiddenStrengthDto>>> getHiddenStrengths(@PathVariable Long assignmentId) {
        List<BlindSpotHiddenStrengthDto> hiddenStrengths = calculationEngineService.calculateHiddenStrengths(assignmentId);
        return ResponseEntity.ok(ApiResponse.success(hiddenStrengths));
    }
}
