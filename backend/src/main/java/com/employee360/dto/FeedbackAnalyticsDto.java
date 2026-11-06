package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;

public class FeedbackAnalyticsDto {
    private BigDecimal overallAverageRating;
    private long totalCompletedReviews;
    private long pendingInvitations;
    private long totalInvitations;
    private double completionPercentage;

    private List<CategoryAverageDto> categoryAverages;
    private List<QuestionAnalysisDto> questionAnalysis;
    private List<RatingDistributionDto> ratingDistribution;

    public FeedbackAnalyticsDto() {}

    public FeedbackAnalyticsDto(BigDecimal overallAverageRating, long totalCompletedReviews,
                                long pendingInvitations, long totalInvitations, double completionPercentage,
                                List<CategoryAverageDto> categoryAverages,
                                List<QuestionAnalysisDto> questionAnalysis,
                                List<RatingDistributionDto> ratingDistribution) {
        this.overallAverageRating = overallAverageRating;
        this.totalCompletedReviews = totalCompletedReviews;
        this.pendingInvitations = pendingInvitations;
        this.totalInvitations = totalInvitations;
        this.completionPercentage = completionPercentage;
        this.categoryAverages = categoryAverages;
        this.questionAnalysis = questionAnalysis;
        this.ratingDistribution = ratingDistribution;
    }

    public BigDecimal getOverallAverageRating() { return overallAverageRating; }
    public void setOverallAverageRating(BigDecimal overallAverageRating) { this.overallAverageRating = overallAverageRating; }

    public long getTotalCompletedReviews() { return totalCompletedReviews; }
    public void setTotalCompletedReviews(long totalCompletedReviews) { this.totalCompletedReviews = totalCompletedReviews; }

    public long getPendingInvitations() { return pendingInvitations; }
    public void setPendingInvitations(long pendingInvitations) { this.pendingInvitations = pendingInvitations; }

    public long getTotalInvitations() { return totalInvitations; }
    public void setTotalInvitations(long totalInvitations) { this.totalInvitations = totalInvitations; }

    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }

    public List<CategoryAverageDto> getCategoryAverages() { return categoryAverages; }
    public void setCategoryAverages(List<CategoryAverageDto> categoryAverages) { this.categoryAverages = categoryAverages; }

    public List<QuestionAnalysisDto> getQuestionAnalysis() { return questionAnalysis; }
    public void setQuestionAnalysis(List<QuestionAnalysisDto> questionAnalysis) { this.questionAnalysis = questionAnalysis; }

    public List<RatingDistributionDto> getRatingDistribution() { return ratingDistribution; }
    public void setRatingDistribution(List<RatingDistributionDto> ratingDistribution) { this.ratingDistribution = ratingDistribution; }

    public static class CategoryAverageDto {
        private String category;
        private String label;
        private BigDecimal averageScore;
        private long count;

        public CategoryAverageDto() {}

        public CategoryAverageDto(String category, String label, BigDecimal averageScore, long count) {
            this.category = category;
            this.label = label;
            this.averageScore = averageScore;
            this.count = count;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public BigDecimal getAverageScore() { return averageScore; }
        public void setAverageScore(BigDecimal averageScore) { this.averageScore = averageScore; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class QuestionAnalysisDto {
        private Long questionId;
        private String categoryName;
        private String questionText;
        private BigDecimal averageScore;
        private long responseCount;

        public QuestionAnalysisDto() {}

        public QuestionAnalysisDto(Long questionId, String categoryName, String questionText, BigDecimal averageScore, long responseCount) {
            this.questionId = questionId;
            this.categoryName = categoryName;
            this.questionText = questionText;
            this.averageScore = averageScore;
            this.responseCount = responseCount;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public BigDecimal getAverageScore() { return averageScore; }
        public void setAverageScore(BigDecimal averageScore) { this.averageScore = averageScore; }

        public long getResponseCount() { return responseCount; }
        public void setResponseCount(long responseCount) { this.responseCount = responseCount; }
    }

    public static class RatingDistributionDto {
        private int starRating; // 1, 2, 3, 4, 5
        private long count;
        private double percentage;

        public RatingDistributionDto() {}

        public RatingDistributionDto(int starRating, long count, double percentage) {
            this.starRating = starRating;
            this.count = count;
            this.percentage = percentage;
        }

        public int getStarRating() { return starRating; }
        public void setStarRating(int starRating) { this.starRating = starRating; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }

        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }
}
