package com.employee360.controller;

import com.employee360.dto.*;
import com.employee360.entity.EmailLog;
import com.employee360.entity.FeedbackCampaign;
import com.employee360.entity.FeedbackInvitation;
import com.employee360.entity.SmtpConfig;
import com.employee360.repository.EmailLogRepository;
import com.employee360.repository.SmtpConfigRepository;
import com.employee360.service.*;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/feedback")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
public class AdminFeedbackController {

    private final FeedbackAnalyticsService analyticsService;
    private final FeedbackInvitationService invitationService;
    private final FeedbackQuestionService questionService;
    private final FeedbackCampaignService campaignService;
    private final EmailService emailService;
    private final EmailLogRepository emailLogRepository;
    private final SmtpConfigRepository smtpConfigRepository;
    private final AdminReviewExportService exportService;

    public AdminFeedbackController(FeedbackAnalyticsService analyticsService,
                                   FeedbackInvitationService invitationService,
                                   FeedbackQuestionService questionService,
                                   FeedbackCampaignService campaignService,
                                   EmailService emailService,
                                   EmailLogRepository emailLogRepository,
                                   SmtpConfigRepository smtpConfigRepository,
                                   AdminReviewExportService exportService) {
        this.analyticsService = analyticsService;
        this.invitationService = invitationService;
        this.questionService = questionService;
        this.campaignService = campaignService;
        this.emailService = emailService;
        this.emailLogRepository = emailLogRepository;
        this.smtpConfigRepository = smtpConfigRepository;
        this.exportService = exportService;
    }

    // 1. Dashboard Overview
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminFeedbackDashboardDto>> getDashboardOverview() {
        AdminFeedbackDashboardDto dto = analyticsService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    // 2. Feedback Campaign Management
    @GetMapping("/campaign")
    public ResponseEntity<ApiResponse<FeedbackCampaign>> getCampaign() {
        FeedbackCampaign campaign = campaignService.getActiveCampaign();
        return ResponseEntity.ok(ApiResponse.success(campaign));
    }

    @PutMapping("/campaign")
    public ResponseEntity<ApiResponse<FeedbackCampaign>> updateCampaign(@RequestBody FeedbackCampaign campaign) {
        FeedbackCampaign updated = campaignService.updateCampaign(campaign);
        return ResponseEntity.ok(ApiResponse.success("Campaign updated successfully", updated));
    }

    // 3. Questions Management
    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<FeedbackQuestionDto>>> getQuestions() {
        List<FeedbackQuestionDto> questions = questionService.getQuestionsForActiveCampaign();
        return ResponseEntity.ok(ApiResponse.success(questions));
    }

    @PostMapping("/questions")
    public ResponseEntity<ApiResponse<FeedbackQuestionDto>> addQuestion(@Valid @RequestBody FeedbackQuestionDto dto) {
        FeedbackQuestionDto created = questionService.createQuestion(dto);
        return ResponseEntity.ok(ApiResponse.success("Question created successfully", created));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<FeedbackQuestionDto>> updateQuestion(@PathVariable Long id,
                                                                           @Valid @RequestBody FeedbackQuestionDto dto) {
        FeedbackQuestionDto updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Question updated successfully", updated));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully", null));
    }

    // 4. Invitations Management
    @GetMapping("/invitations")
    public ResponseEntity<ApiResponse<List<FeedbackInvitation>>> getInvitations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        List<FeedbackInvitation> list = invitationService.getInvitations(status, category, query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/invitations")
    public ResponseEntity<ApiResponse<FeedbackInvitation>> sendInvitation(@Valid @RequestBody FeedbackInvitationRequest request) {
        FeedbackInvitation invitation = invitationService.sendInvitation(request);
        String msg;
        if ("SENT".equalsIgnoreCase(invitation.getEmailDeliveryStatus())) {
            msg = "Real email invitation successfully delivered to " + invitation.getReviewerEmail() + " via SMTP!";
        } else if ("FAILED".equalsIgnoreCase(invitation.getEmailDeliveryStatus())) {
            msg = "Invitation created with review link! (Note: SMTP failed: " + invitation.getEmailDeliveryError() + ". You can copy the link below to share with your employee, or add your Google App Password in Email Management).";
        } else {
            msg = "Invitation created with direct review link for " + invitation.getReviewerEmail() + "!";
        }
        return ResponseEntity.ok(ApiResponse.success(msg, invitation));
    }

    @PostMapping("/invitations/bulk")
    public ResponseEntity<ApiResponse<List<FeedbackInvitation>>> sendBulkInvitations(@Valid @RequestBody BulkInvitationRequest request) {
        List<FeedbackInvitation> list = invitationService.sendBulkInvitations(request);
        return ResponseEntity.ok(ApiResponse.success("Bulk invitations dispatched successfully (" + list.size() + ")", list));
    }

    @PostMapping("/invitations/{id}/resend")
    public ResponseEntity<ApiResponse<Void>> resendInvitation(@PathVariable Long id) {
        invitationService.resendInvitation(id);
        return ResponseEntity.ok(ApiResponse.success("Invitation email resent successfully", null));
    }

    @PostMapping("/invitations/{id}/retry")
    public ResponseEntity<ApiResponse<FeedbackInvitation>> retryInvitation(@PathVariable Long id) {
        FeedbackInvitation retried = invitationService.retryInvitation(id);
        String msg = "SENT".equalsIgnoreCase(retried.getEmailDeliveryStatus())
                ? "Invitation email successfully delivered to " + retried.getReviewerEmail() + "!"
                : "Retry completed. Status: " + retried.getEmailDeliveryStatus() + (retried.getEmailDeliveryError() != null ? " (" + retried.getEmailDeliveryError() + ")" : "");
        return ResponseEntity.ok(ApiResponse.success(msg, retried));
    }

    @DeleteMapping("/invitations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInvitation(@PathVariable Long id) {
        invitationService.deleteInvitation(id);
        return ResponseEntity.ok(ApiResponse.success("Invitation removed successfully", null));
    }

    // 5. Submitted Reviews Management
    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<AdminReviewItemDetailDto>>> getSubmissions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        List<AdminReviewItemDetailDto> submissions = invitationService.getSubmissions(category, query);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<ApiResponse<AdminReviewItemDetailDto>> getSubmissionById(@PathVariable Long id) {
        AdminReviewItemDetailDto detail = invitationService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    // 6. Analytics Section
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<FeedbackAnalyticsDto>> getDetailedAnalytics() {
        FeedbackAnalyticsDto analytics = analyticsService.getDetailedAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    // 7. CSV Export
    @GetMapping("/export/csv")
    public ResponseEntity<InputStreamResource> exportSubmissionsCsv() {
        ByteArrayInputStream in = exportService.exportReviewsToCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Admin_360_Feedback_Reviews.csv");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }

    // 8. Email Management & SMTP Configuration
    @GetMapping("/email/logs")
    public ResponseEntity<ApiResponse<List<EmailLog>>> getEmailLogs() {
        List<EmailLog> logs = emailLogRepository.findAllByOrderBySentAtDesc();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/email/config")
    public ResponseEntity<ApiResponse<SmtpConfig>> getSmtpConfig() {
        SmtpConfig config = smtpConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> smtpConfigRepository.save(new SmtpConfig()));
        return ResponseEntity.ok(ApiResponse.success(config));
    }

    @PostMapping("/email/config")
    public ResponseEntity<ApiResponse<SmtpConfig>> saveSmtpConfig(@RequestBody SmtpConfig config) {
        SmtpConfig existing = smtpConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(SmtpConfig::new);
        existing.setHost(config.getHost());
        existing.setPort(config.getPort());
        existing.setUsername(config.getUsername());
        if (config.getPassword() != null && !config.getPassword().isBlank()) {
            existing.setPassword(config.getPassword());
        }
        existing.setFromEmail(config.getFromEmail());
        existing.setFromName(config.getFromName());
        existing.setAuthEnabled(config.isAuthEnabled());
        existing.setStartTlsEnabled(config.isStartTlsEnabled());
        existing.setActive(config.isActive());
        if (config.getProviderType() != null && !config.getProviderType().isBlank()) {
            existing.setProviderType(config.getProviderType().trim().toUpperCase());
        }
        if (config.getApiKey() != null && !config.getApiKey().isBlank()) {
            existing.setApiKey(config.getApiKey().trim());
        }
        SmtpConfig saved = smtpConfigRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("SMTP configuration saved successfully", saved));
    }

    @PostMapping("/email/test")
    public ResponseEntity<ApiResponse<Void>> sendTestEmail(@RequestBody Map<String, String> body) {
        String to = body.get("email");
        if (to == null || to.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Recipient email is required"));
        }
        EmailService.EmailDispatchResult result = emailService.sendTestEmail(to.trim());
        if (result.isSuccess() && "SENT".equalsIgnoreCase(result.getStatus())) {
            return ResponseEntity.ok(ApiResponse.success("Test email dispatched successfully to " + to.trim() + " via SMTP!", null));
        } else if ("FAILED".equalsIgnoreCase(result.getStatus())) {
            return ResponseEntity.ok(ApiResponse.error("SMTP delivery failed: " + result.getErrorMessage() + ". (Note: For Gmail, ensure you use a 16-character Google App Password with 2FA enabled, not your regular account password)."));
        } else {
            return ResponseEntity.ok(ApiResponse.success("Test simulated (SMTP inactive or credentials empty). Direct link recorded.", null));
        }
    }

    // 9. Clear All Demo & Test Data (Leaves clean state for real reviews)
    @PostMapping("/reset-demo-data")
    public ResponseEntity<ApiResponse<Void>> resetDemoData() {
        invitationService.clearAllFeedbackData();
        return ResponseEntity.ok(ApiResponse.success("All test/demo feedback data has been cleared. Dashboard is completely clean and ready for real submissions.", null));
    }
}
