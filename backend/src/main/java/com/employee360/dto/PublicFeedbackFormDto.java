package com.employee360.dto;

import java.util.List;

public class PublicFeedbackFormDto {
    private String token;
    private Long campaignId;
    private String campaignTitle;
    private String adminName;
    private String adminTitle;
    private String reviewerName;
    private String reviewerEmail;
    private String reviewCategory;
    private String status; // PENDING, SUBMITTED, EXPIRED
    private String instructions;
    private List<FeedbackQuestionDto> questions;

    public PublicFeedbackFormDto() {}

    public PublicFeedbackFormDto(String token, Long campaignId, String campaignTitle, String adminName,
                                 String adminTitle, String reviewerName, String reviewerEmail,
                                 String reviewCategory, String status, String instructions,
                                 List<FeedbackQuestionDto> questions) {
        this.token = token;
        this.campaignId = campaignId;
        this.campaignTitle = campaignTitle;
        this.adminName = adminName;
        this.adminTitle = adminTitle;
        this.reviewerName = reviewerName;
        this.reviewerEmail = reviewerEmail;
        this.reviewCategory = reviewCategory;
        this.status = status;
        this.instructions = instructions;
        this.questions = questions;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getCampaignId() { return campaignId; }
    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }

    public String getCampaignTitle() { return campaignTitle; }
    public void setCampaignTitle(String campaignTitle) { this.campaignTitle = campaignTitle; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminTitle() { return adminTitle; }
    public void setAdminTitle(String adminTitle) { this.adminTitle = adminTitle; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

    public String getReviewCategory() { return reviewCategory; }
    public void setReviewCategory(String reviewCategory) { this.reviewCategory = reviewCategory; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public List<FeedbackQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<FeedbackQuestionDto> questions) { this.questions = questions; }
}
