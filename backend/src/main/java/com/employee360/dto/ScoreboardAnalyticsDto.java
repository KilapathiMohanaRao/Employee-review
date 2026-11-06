package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;

public class ScoreboardAnalyticsDto {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String department;
    private String designation;
    private String avatarUrl;
    private BigDecimal overallScore;
    private BigDecimal selfAverage;
    private BigDecimal managerAverage;
    private BigDecimal othersAverage;
    private BigDecimal benchmarkTarget;
    private BigDecimal consensusAlignmentScore;
    private List<String> topStrengths;
    private List<String> topDevelopmentAreas;
    private int blindSpotCount;
    private int hiddenStrengthCount;
    private List<CompetencyScorecardDto> competencyScorecards;

    public ScoreboardAnalyticsDto() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }

    public BigDecimal getSelfAverage() { return selfAverage; }
    public void setSelfAverage(BigDecimal selfAverage) { this.selfAverage = selfAverage; }

    public BigDecimal getManagerAverage() { return managerAverage; }
    public void setManagerAverage(BigDecimal managerAverage) { this.managerAverage = managerAverage; }

    public BigDecimal getOthersAverage() { return othersAverage; }
    public void setOthersAverage(BigDecimal othersAverage) { this.othersAverage = othersAverage; }

    public BigDecimal getBenchmarkTarget() { return benchmarkTarget; }
    public void setBenchmarkTarget(BigDecimal benchmarkTarget) { this.benchmarkTarget = benchmarkTarget; }

    public BigDecimal getConsensusAlignmentScore() { return consensusAlignmentScore; }
    public void setConsensusAlignmentScore(BigDecimal consensusAlignmentScore) { this.consensusAlignmentScore = consensusAlignmentScore; }

    public List<String> getTopStrengths() { return topStrengths; }
    public void setTopStrengths(List<String> topStrengths) { this.topStrengths = topStrengths; }

    public List<String> getTopDevelopmentAreas() { return topDevelopmentAreas; }
    public void setTopDevelopmentAreas(List<String> topDevelopmentAreas) { this.topDevelopmentAreas = topDevelopmentAreas; }

    public int getBlindSpotCount() { return blindSpotCount; }
    public void setBlindSpotCount(int blindSpotCount) { this.blindSpotCount = blindSpotCount; }

    public int getHiddenStrengthCount() { return hiddenStrengthCount; }
    public void setHiddenStrengthCount(int hiddenStrengthCount) { this.hiddenStrengthCount = hiddenStrengthCount; }

    public List<CompetencyScorecardDto> getCompetencyScorecards() { return competencyScorecards; }
    public void setCompetencyScorecards(List<CompetencyScorecardDto> competencyScorecards) { this.competencyScorecards = competencyScorecards; }
}
