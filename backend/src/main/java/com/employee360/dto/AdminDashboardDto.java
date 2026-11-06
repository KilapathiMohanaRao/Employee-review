package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalEmployees;
    private long activeAssessmentCycles;
    private long completedAssessments;
    private long pendingAssessments;
    private double overallCompletionPercentage;
    private BigDecimal averageCompetencyScore;
    private List<DepartmentPerformanceDto> departmentPerformance;
    private Map<String, Long> assessmentsByStatus;
    private List<CompetencyScorecardDto> topRankedCompetencies;
    private List<CompetencyScorecardDto> lowestRankedCompetencies;

    public AdminDashboardDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveAssessmentCycles() { return activeAssessmentCycles; }
    public void setActiveAssessmentCycles(long activeAssessmentCycles) { this.activeAssessmentCycles = activeAssessmentCycles; }

    public long getCompletedAssessments() { return completedAssessments; }
    public void setCompletedAssessments(long completedAssessments) { this.completedAssessments = completedAssessments; }

    public long getPendingAssessments() { return pendingAssessments; }
    public void setPendingAssessments(long pendingAssessments) { this.pendingAssessments = pendingAssessments; }

    public double getOverallCompletionPercentage() { return overallCompletionPercentage; }
    public void setOverallCompletionPercentage(double overallCompletionPercentage) { this.overallCompletionPercentage = overallCompletionPercentage; }

    public BigDecimal getAverageCompetencyScore() { return averageCompetencyScore; }
    public void setAverageCompetencyScore(BigDecimal averageCompetencyScore) { this.averageCompetencyScore = averageCompetencyScore; }

    public List<DepartmentPerformanceDto> getDepartmentPerformance() { return departmentPerformance; }
    public void setDepartmentPerformance(List<DepartmentPerformanceDto> departmentPerformance) { this.departmentPerformance = departmentPerformance; }

    public Map<String, Long> getAssessmentsByStatus() { return assessmentsByStatus; }
    public void setAssessmentsByStatus(Map<String, Long> assessmentsByStatus) { this.assessmentsByStatus = assessmentsByStatus; }

    public List<CompetencyScorecardDto> getTopRankedCompetencies() { return topRankedCompetencies; }
    public void setTopRankedCompetencies(List<CompetencyScorecardDto> topRankedCompetencies) { this.topRankedCompetencies = topRankedCompetencies; }

    public List<CompetencyScorecardDto> getLowestRankedCompetencies() { return lowestRankedCompetencies; }
    public void setLowestRankedCompetencies(List<CompetencyScorecardDto> lowestRankedCompetencies) { this.lowestRankedCompetencies = lowestRankedCompetencies; }
}
