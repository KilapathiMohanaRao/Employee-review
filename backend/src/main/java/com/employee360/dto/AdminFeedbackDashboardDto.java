package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminFeedbackDashboardDto {
    private long totalInvitationsSent;
    private long totalSubmissions;
    private long pendingSubmissions;
    private long completedSubmissions;
    private BigDecimal overallAverageRating;
    private double completionPercentage;
    private String adminName;
    private String adminTitle;
    private String campaignTitle;
    private List<CategoryMetricDto> categoryMetrics;
    private List<AdminReviewSummaryItemDto> recentSubmissions;

    public AdminFeedbackDashboardDto() {}

    public AdminFeedbackDashboardDto(long totalInvitationsSent, long totalSubmissions, long pendingSubmissions,
                                     long completedSubmissions, BigDecimal overallAverageRating,
                                     double completionPercentage, String adminName, String adminTitle,
                                     String campaignTitle, List<CategoryMetricDto> categoryMetrics,
                                     List<AdminReviewSummaryItemDto> recentSubmissions) {
        this.totalInvitationsSent = totalInvitationsSent;
        this.totalSubmissions = totalSubmissions;
        this.pendingSubmissions = pendingSubmissions;
        this.completedSubmissions = completedSubmissions;
        this.overallAverageRating = overallAverageRating;
        this.completionPercentage = completionPercentage;
        this.adminName = adminName;
        this.adminTitle = adminTitle;
        this.campaignTitle = campaignTitle;
        this.categoryMetrics = categoryMetrics;
        this.recentSubmissions = recentSubmissions;
    }

    public long getTotalInvitationsSent() { return totalInvitationsSent; }
    public void setTotalInvitationsSent(long totalInvitationsSent) { this.totalInvitationsSent = totalInvitationsSent; }

    public long getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(long totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public long getPendingSubmissions() { return pendingSubmissions; }
    public void setPendingSubmissions(long pendingSubmissions) { this.pendingSubmissions = pendingSubmissions; }

    public long getCompletedSubmissions() { return completedSubmissions; }
    public void setCompletedSubmissions(long completedSubmissions) { this.completedSubmissions = completedSubmissions; }

    public BigDecimal getOverallAverageRating() { return overallAverageRating; }
    public void setOverallAverageRating(BigDecimal overallAverageRating) { this.overallAverageRating = overallAverageRating; }

    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminTitle() { return adminTitle; }
    public void setAdminTitle(String adminTitle) { this.adminTitle = adminTitle; }

    public String getCampaignTitle() { return campaignTitle; }
    public void setCampaignTitle(String campaignTitle) { this.campaignTitle = campaignTitle; }

    public List<CategoryMetricDto> getCategoryMetrics() { return categoryMetrics; }
    public void setCategoryMetrics(List<CategoryMetricDto> categoryMetrics) { this.categoryMetrics = categoryMetrics; }

    public List<AdminReviewSummaryItemDto> getRecentSubmissions() { return recentSubmissions; }
    public void setRecentSubmissions(List<AdminReviewSummaryItemDto> recentSubmissions) { this.recentSubmissions = recentSubmissions; }

    public static class CategoryMetricDto {
        private String category;
        private String label;
        private long totalSent;
        private long completed;
        private BigDecimal averageRating;

        public CategoryMetricDto() {}

        public CategoryMetricDto(String category, String label, long totalSent, long completed, BigDecimal averageRating) {
            this.category = category;
            this.label = label;
            this.totalSent = totalSent;
            this.completed = completed;
            this.averageRating = averageRating;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public long getTotalSent() { return totalSent; }
        public void setTotalSent(long totalSent) { this.totalSent = totalSent; }

        public long getCompleted() { return completed; }
        public void setCompleted(long completed) { this.completed = completed; }

        public BigDecimal getAverageRating() { return averageRating; }
        public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    }

    public static class AdminReviewSummaryItemDto {
        private Long id;
        private String reviewerName;
        private String reviewerEmail;
        private String reviewCategory;
        private BigDecimal overallRating;
        private String submittedAt;
        private String summaryFeedback;

        public AdminReviewSummaryItemDto() {}

        public AdminReviewSummaryItemDto(Long id, String reviewerName, String reviewerEmail, String reviewCategory,
                                         BigDecimal overallRating, String submittedAt, String summaryFeedback) {
            this.id = id;
            this.reviewerName = reviewerName;
            this.reviewerEmail = reviewerEmail;
            this.reviewCategory = reviewCategory;
            this.overallRating = overallRating;
            this.submittedAt = submittedAt;
            this.summaryFeedback = summaryFeedback;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getReviewerName() { return reviewerName; }
        public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

        public String getReviewerEmail() { return reviewerEmail; }
        public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

        public String getReviewCategory() { return reviewCategory; }
        public void setReviewCategory(String reviewCategory) { this.reviewCategory = reviewCategory; }

        public BigDecimal getOverallRating() { return overallRating; }
        public void setOverallRating(BigDecimal overallRating) { this.overallRating = overallRating; }

        public String getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

        public String getSummaryFeedback() { return summaryFeedback; }
        public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }
    }
}
