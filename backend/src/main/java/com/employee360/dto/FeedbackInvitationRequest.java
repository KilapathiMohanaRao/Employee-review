package com.employee360.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class FeedbackInvitationRequest {

    @NotBlank(message = "Reviewer name is required")
    private String reviewerName;

    @NotBlank(message = "Reviewer email is required")
    @Email(message = "Valid email address is required")
    private String reviewerEmail;

    @NotBlank(message = "Review category is required")
    private String reviewCategory; // SELF, MANAGER, PEER_1, PEER_2, PEER_3, TEAM_LEAD, HR, GENERAL

    private String instructions;

    private Integer expiryDays = 14;

    public FeedbackInvitationRequest() {}

    public FeedbackInvitationRequest(String reviewerName, String reviewerEmail, String reviewCategory,
                                     String instructions, Integer expiryDays) {
        this.reviewerName = reviewerName;
        this.reviewerEmail = reviewerEmail;
        this.reviewCategory = reviewCategory;
        this.instructions = instructions;
        this.expiryDays = expiryDays;
    }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName != null ? reviewerName.trim() : null;
    }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) {
        this.reviewerEmail = reviewerEmail != null ? reviewerEmail.trim().toLowerCase() : null;
    }

    public String getReviewCategory() { return reviewCategory; }
    public void setReviewCategory(String reviewCategory) {
        this.reviewCategory = reviewCategory != null ? reviewCategory.trim().toUpperCase() : null;
    }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Integer getExpiryDays() { return expiryDays; }
    public void setExpiryDays(Integer expiryDays) { this.expiryDays = expiryDays; }
}
