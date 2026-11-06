package com.employee360.controller;

import com.employee360.dto.AdminReviewDto;
import com.employee360.dto.AdminReviewSummaryDto;
import com.employee360.dto.ApiResponse;
import com.employee360.service.PrivateReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reviews")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
public class AdminReviewController {

    private final PrivateReviewService privateReviewService;

    public AdminReviewController(PrivateReviewService privateReviewService) {
        this.privateReviewService = privateReviewService;
    }

    /**
     * ADMIN-ONLY: Get all submitted employee reviews with filters and search.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminReviewDto>>> getAllReviews(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating) {
        List<AdminReviewDto> reviews = privateReviewService.getAllSubmittedReviews(search, department, minRating, maxRating);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    /**
     * ADMIN-ONLY: Get executive review summary statistics for the Admin Dashboard.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AdminReviewSummaryDto>> getReviewSummary() {
        AdminReviewSummaryDto summary = privateReviewService.getAdminReviewSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    /**
     * ADMIN-ONLY: Get detailed inspection of a specific review.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminReviewDto>> getReviewDetail(@PathVariable Long id) {
        AdminReviewDto detail = privateReviewService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    /**
     * ADMIN-ONLY: Generate shareable review form links for employees.
     */
    @PostMapping("/generate-link")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateReviewLink(
            @RequestBody(required = false) Map<String, Object> body) {
        Long evaluateeId = body != null && body.get("evaluateeId") != null
                ? Long.valueOf(body.get("evaluateeId").toString())
                : null;
        Long cycleId = body != null && body.get("cycleId") != null
                ? Long.valueOf(body.get("cycleId").toString())
                : null;

        StringBuilder url = new StringBuilder("/review-form");
        boolean hasQuery = false;
        if (evaluateeId != null) {
            url.append("?evaluateeId=").append(evaluateeId);
            hasQuery = true;
        }
        if (cycleId != null) {
            url.append(hasQuery ? "&cycleId=" : "?cycleId=").append(cycleId);
        }

        Map<String, String> res = new HashMap<>();
        res.put("url", url.toString());
        res.put("fullUrl", "http://localhost:5173" + url.toString());
        res.put("message", "Shareable review link generated successfully");

        return ResponseEntity.ok(ApiResponse.success("Review link generated", res));
    }
}
