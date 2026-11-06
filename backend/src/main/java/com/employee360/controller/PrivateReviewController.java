package com.employee360.controller;

import com.employee360.dto.ApiResponse;
import com.employee360.dto.PublicReviewSubmissionRequest;
import com.employee360.dto.ReviewFormDataDto;
import com.employee360.service.PrivateReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class PrivateReviewController {

    private final PrivateReviewService privateReviewService;

    public PrivateReviewController(PrivateReviewService privateReviewService) {
        this.privateReviewService = privateReviewService;
    }

    /**
     * Public/Employee endpoint to fetch review form metadata (evaluatees and rating categories).
     */
    @GetMapping("/form-data")
    public ResponseEntity<ApiResponse<ReviewFormDataDto>> getReviewFormData(
            @RequestParam(required = false) Long evaluateeId) {
        ReviewFormDataDto data = privateReviewService.getReviewFormData(evaluateeId);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * Submit an employee review.
     * Enforces privacy: Returns ONLY a success confirmation message.
     * NEVER returns submitted ratings, scores, or comments.
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submitReview(
            @Valid @RequestBody PublicReviewSubmissionRequest request) {
        privateReviewService.submitPrivateReview(request);
        return ResponseEntity.ok(ApiResponse.success("Your review has been submitted successfully.", null));
    }
}
