package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminReviewSummaryDto {
    private long totalSubmittedReviews;
    private BigDecimal overallAverageRating;
    private long totalEvaluatees;
    private long totalReviewers;
    private Map<String, Long> departmentBreakdown;
    private Map<String, BigDecimal> categoryAverages;
    private List<AdminReviewDto> recentReviews;

    public AdminReviewSummaryDto() {}

    public long getTotalSubmittedReviews() { return totalSubmittedReviews; }
    public void setTotalSubmittedReviews(long totalSubmittedReviews) { this.totalSubmittedReviews = totalSubmittedReviews; }

    public BigDecimal getOverallAverageRating() { return overallAverageRating; }
    public void setOverallAverageRating(BigDecimal overallAverageRating) { this.overallAverageRating = overallAverageRating; }

    public long getTotalEvaluatees() { return totalEvaluatees; }
    public void setTotalEvaluatees(long totalEvaluatees) { this.totalEvaluatees = totalEvaluatees; }

    public long getTotalReviewers() { return totalReviewers; }
    public void setTotalReviewers(long totalReviewers) { this.totalReviewers = totalReviewers; }

    public Map<String, Long> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(Map<String, Long> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }

    public Map<String, BigDecimal> getCategoryAverages() { return categoryAverages; }
    public void setCategoryAverages(Map<String, BigDecimal> categoryAverages) { this.categoryAverages = categoryAverages; }

    public List<AdminReviewDto> getRecentReviews() { return recentReviews; }
    public void setRecentReviews(List<AdminReviewDto> recentReviews) { this.recentReviews = recentReviews; }
}
