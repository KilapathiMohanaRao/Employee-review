package com.employee360.controller;

import com.employee360.dto.ApiResponse;
import com.employee360.dto.FeedbackSubmissionRequest;
import com.employee360.dto.PublicFeedbackFormDto;
import com.employee360.service.FeedbackInvitationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class PublicFeedbackController {

    private final FeedbackInvitationService invitationService;

    public PublicFeedbackController(FeedbackInvitationService invitationService) {
        this.invitationService = invitationService;
    }

    /**
     * Validate an invitation token and retrieve its assigned unanswered feedback form.
     * Public endpoint - zero login or registration required.
     * Supports both query parameter (?token=...) and path parameter (/form/{token}).
     */
    @GetMapping({"/form", "/form/{token}", "/validate", "/validate/{token}"})
    public ResponseEntity<ApiResponse<PublicFeedbackFormDto>> getFeedbackForm(
            @PathVariable(required = false) String token,
            @RequestParam(name = "token", required = false) String tokenParam) {
        String effectiveToken = (token != null && !token.isBlank()) ? token : tokenParam;
        PublicFeedbackFormDto formDto = invitationService.validateAndGetForm(effectiveToken);
        return ResponseEntity.ok(ApiResponse.success(formDto));
    }

    /**
     * Submit feedback for an invitation.
     * Public endpoint - single-use submission.
     * Once submitted, the token is permanently invalidated.
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(@Valid @RequestBody FeedbackSubmissionRequest request) {
        invitationService.submitFeedback(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Your feedback has been submitted successfully. Thank you for your valuable feedback.",
                null
        ));
    }

    /**
     * Webhook for mail delivery status updates (Delivered, Bounced, Opened).
     * Public endpoint for transactional providers.
     */
    @PostMapping("/email/webhook")
    public ResponseEntity<ApiResponse<Void>> handleEmailWebhook(@RequestBody Map<String, Object> payload) {
        String event = payload.get("event") != null ? payload.get("event").toString() : "delivered";
        String email = payload.get("email") != null ? payload.get("email").toString() : null;
        String token = payload.get("token") != null ? payload.get("token").toString() : null;
        String reason = payload.get("reason") != null ? payload.get("reason").toString() : null;
        invitationService.handleWebhookEvent(event, email, token, reason);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed", null));
    }
}
