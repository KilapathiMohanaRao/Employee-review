package com.employee360.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PublicReviewSubmissionRequest {

    @NotNull(message = "Evaluatee employee ID is required")
    private Long evaluateeEmployeeId;

    private Long reviewerEmployeeId;
    private String reviewerEmail;
    private String reviewerName;

    private Long cycleId;

    private String reviewType = "PEER"; // PEER, MANAGER, DIRECT_REPORT, CROSS_FUNCTIONAL, SELF
    private boolean anonymous = false;

    private List<CategoryRatingItemDto> categoryRatings;

    private String summaryFeedback;
    private String keyStrengthsComment;
    private String developmentAreasComment;

    public PublicReviewSubmissionRequest() {}

    public Long getEvaluateeEmployeeId() { return evaluateeEmployeeId; }
    public void setEvaluateeEmployeeId(Long evaluateeEmployeeId) { this.evaluateeEmployeeId = evaluateeEmployeeId; }

    public Long getReviewerEmployeeId() { return reviewerEmployeeId; }
    public void setReviewerEmployeeId(Long reviewerEmployeeId) { this.reviewerEmployeeId = reviewerEmployeeId; }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public Long getCycleId() { return cycleId; }
    public void setCycleId(Long cycleId) { this.cycleId = cycleId; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }

    public List<CategoryRatingItemDto> getCategoryRatings() { return categoryRatings; }
    public void setCategoryRatings(List<CategoryRatingItemDto> categoryRatings) { this.categoryRatings = categoryRatings; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getKeyStrengthsComment() { return keyStrengthsComment; }
    public void setKeyStrengthsComment(String keyStrengthsComment) { this.keyStrengthsComment = keyStrengthsComment; }

    public String getDevelopmentAreasComment() { return developmentAreasComment; }
    public void setDevelopmentAreasComment(String developmentAreasComment) { this.developmentAreasComment = developmentAreasComment; }
}
