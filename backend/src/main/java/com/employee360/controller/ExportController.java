package com.employee360.controller;

import com.employee360.service.ExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exports")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/360-scorecard/{employeeId}")
    public ResponseEntity<byte[]> export360Scorecard(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Long cycleId) {

        byte[] csv = exportService.generate360ScorecardCsv(employeeId, cycleId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"360_scorecard_emp_" + employeeId + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/development-plans/{employeeId}")
    public ResponseEntity<byte[]> exportDevelopmentPlans(@PathVariable Long employeeId) {
        byte[] csv = exportService.generateDevelopmentPlansCsv(employeeId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"development_plans_emp_" + employeeId + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
}
