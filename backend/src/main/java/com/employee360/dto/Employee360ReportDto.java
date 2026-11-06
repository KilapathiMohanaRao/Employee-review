package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;

public class Employee360ReportDto {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String designationTitle;
    private String managerName;
    private String avatarUrl;

    private Long cycleId;
    private String cycleTitle;
    private String status;
    private BigDecimal overallScore;

    private int totalReviewers;
    private int completedReviews;

    private List<CompetencyScorecardDto> scorecards;
    private List<StrengthDevelopmentDto> topStrengths;
    private List<StrengthDevelopmentDto> topDevelopmentAreas;
    private List<BlindSpotHiddenStrengthDto> blindSpots;
    private List<BlindSpotHiddenStrengthDto> hiddenStrengths;
    private List<String> qualitativeStrengths;
    private List<String> qualitativeDevelopmentAreas;
    private List<String> generalFeedback;

    public Employee360ReportDto() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDesignationTitle() { return designationTitle; }
    public void setDesignationTitle(String designationTitle) { this.designationTitle = designationTitle; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Long getCycleId() { return cycleId; }
    public void setCycleId(Long cycleId) { this.cycleId = cycleId; }

    public String getCycleTitle() { return cycleTitle; }
    public void setCycleTitle(String cycleTitle) { this.cycleTitle = cycleTitle; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }

    public int getTotalReviewers() { return totalReviewers; }
    public void setTotalReviewers(int totalReviewers) { this.totalReviewers = totalReviewers; }

    public int getCompletedReviews() { return completedReviews; }
    public void setCompletedReviews(int completedReviews) { this.completedReviews = completedReviews; }

    public List<CompetencyScorecardDto> getScorecards() { return scorecards; }
    public void setScorecards(List<CompetencyScorecardDto> scorecards) { this.scorecards = scorecards; }

    public List<StrengthDevelopmentDto> getTopStrengths() { return topStrengths; }
    public void setTopStrengths(List<StrengthDevelopmentDto> topStrengths) { this.topStrengths = topStrengths; }

    public List<StrengthDevelopmentDto> getTopDevelopmentAreas() { return topDevelopmentAreas; }
    public void setTopDevelopmentAreas(List<StrengthDevelopmentDto> topDevelopmentAreas) { this.topDevelopmentAreas = topDevelopmentAreas; }

    public List<BlindSpotHiddenStrengthDto> getBlindSpots() { return blindSpots; }
    public void setBlindSpots(List<BlindSpotHiddenStrengthDto> blindSpots) { this.blindSpots = blindSpots; }

    public List<BlindSpotHiddenStrengthDto> getHiddenStrengths() { return hiddenStrengths; }
    public void setHiddenStrengths(List<BlindSpotHiddenStrengthDto> hiddenStrengths) { this.hiddenStrengths = hiddenStrengths; }

    public List<String> getQualitativeStrengths() { return qualitativeStrengths; }
    public void setQualitativeStrengths(List<String> qualitativeStrengths) { this.qualitativeStrengths = qualitativeStrengths; }

    public List<String> getQualitativeDevelopmentAreas() { return qualitativeDevelopmentAreas; }
    public void setQualitativeDevelopmentAreas(List<String> qualitativeDevelopmentAreas) { this.qualitativeDevelopmentAreas = qualitativeDevelopmentAreas; }

    public List<String> getGeneralFeedback() { return generalFeedback; }
    public void setGeneralFeedback(List<String> generalFeedback) { this.generalFeedback = generalFeedback; }
}
