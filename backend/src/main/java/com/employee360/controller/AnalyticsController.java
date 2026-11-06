package com.employee360.controller;

import com.employee360.dto.*;
import com.employee360.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardMetrics() {
        AdminDashboardDto metrics = analyticsService.getAdminDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/radar/{employeeId}")
    public ResponseEntity<ApiResponse<List<RadarChartDto>>> getRadarChartData(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Long cycleId) {
        List<RadarChartDto> radarPoints = analyticsService.getRadarChartData(employeeId, cycleId);
        return ResponseEntity.ok(ApiResponse.success(radarPoints));
    }

    @GetMapping("/heatmap")
    public ResponseEntity<ApiResponse<List<HeatmapItemDto>>> getCompetencyHeatmap() {
        List<HeatmapItemDto> heatmap = analyticsService.getCompetencyHeatmap();
        return ResponseEntity.ok(ApiResponse.success(heatmap));
    }

    @GetMapping("/talent-matrix")
    public ResponseEntity<ApiResponse<TalentMatrixResponseDto>> getTalentMatrix() {
        TalentMatrixResponseDto matrix = analyticsService.getTalentMatrixData();
        return ResponseEntity.ok(ApiResponse.success(matrix));
    }

    @GetMapping("/scoreboard/{employeeId}")
    public ResponseEntity<ApiResponse<ScoreboardAnalyticsDto>> getEmployeeScoreboard(
            @PathVariable Long employeeId) {
        ScoreboardAnalyticsDto scoreboard = analyticsService.getEmployeeScoreboardAnalytics(employeeId);
        return ResponseEntity.ok(ApiResponse.success(scoreboard));
    }
}
