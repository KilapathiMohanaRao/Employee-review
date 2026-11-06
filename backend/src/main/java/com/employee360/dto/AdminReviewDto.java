package com.employee360.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminReviewDto {
    private Long reviewId;

    // Evaluatee details
    private Long evaluateeId;
    private String evaluateeName;
    private String evaluateeCode;
    private String evaluateeDepartment;
    private String evaluateeDesignation;
    private String evaluateeAvatar;

    // Reviewer details
    private Long reviewerId;
    private String reviewerName;
    private String reviewerCode;
    private String reviewerDepartment;
    private String reviewerDesignation;
    private String reviewType;
    private boolean anonymous;

    // Scores & ratings
    private BigDecimal overallRating;
    private List<CategoryRatingItemDto> categoryRatings;

    // Feedback comments
    private String summaryFeedback;
    private String keyStrengthsComment;
    private String developmentAreasComment;

    // Audit & status
    private String status;
    private boolean isLocked;
    private LocalDateTime submittedAt;
    private String cycleTitle;

    public AdminReviewDto() {}

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }

    public Long getEvaluateeId() { return evaluateeId; }
    public void setEvaluateeId(Long evaluateeId) { this.evaluateeId = evaluateeId; }

    public String getEvaluateeName() { return evaluateeName; }
    public void setEvaluateeName(String evaluateeName) { this.evaluateeName = evaluateeName; }

    public String getEvaluateeCode() { return evaluateeCode; }
    public void setEvaluateeCode(String evaluateeCode) { this.evaluateeCode = evaluateeCode; }

    public String getEvaluateeDepartment() { return evaluateeDepartment; }
    public void setEvaluateeDepartment(String evaluateeDepartment) { this.evaluateeDepartment = evaluateeDepartment; }

    public String getEvaluateeDesignation() { return evaluateeDesignation; }
    public void setEvaluateeDesignation(String evaluateeDesignation) { this.evaluateeDesignation = evaluateeDesignation; }

    public String getEvaluateeAvatar() { return evaluateeAvatar; }
    public void setEvaluateeAvatar(String evaluateeAvatar) { this.evaluateeAvatar = evaluateeAvatar; }

    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerCode() { return reviewerCode; }
    public void setReviewerCode(String reviewerCode) { this.reviewerCode = reviewerCode; }

    public String getReviewerDepartment() { return reviewerDepartment; }
    public void setReviewerDepartment(String reviewerDepartment) { this.reviewerDepartment = reviewerDepartment; }

    public String getReviewerDesignation() { return reviewerDesignation; }
    public void setReviewerDesignation(String reviewerDesignation) { this.reviewerDesignation = reviewerDesignation; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }

    public BigDecimal getOverallRating() { return overallRating; }
    public void setOverallRating(BigDecimal overallRating) { this.overallRating = overallRating; }

    public List<CategoryRatingItemDto> getCategoryRatings() { return categoryRatings; }
    public void setCategoryRatings(List<CategoryRatingItemDto> categoryRatings) { this.categoryRatings = categoryRatings; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getKeyStrengthsComment() { return keyStrengthsComment; }
    public void setKeyStrengthsComment(String keyStrengthsComment) { this.keyStrengthsComment = keyStrengthsComment; }

    public String getDevelopmentAreasComment() { return developmentAreasComment; }
    public void setDevelopmentAreasComment(String developmentAreasComment) { this.developmentAreasComment = developmentAreasComment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public String getCycleTitle() { return cycleTitle; }
    public void setCycleTitle(String cycleTitle) { this.cycleTitle = cycleTitle; }
}
