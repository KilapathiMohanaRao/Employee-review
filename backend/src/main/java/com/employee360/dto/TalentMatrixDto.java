package com.employee360.dto;

import java.math.BigDecimal;

public class TalentMatrixDto {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String department;
    private String designation;
    private String avatarUrl;
    private BigDecimal performanceScore;
    private BigDecimal potentialScore;
    private String quadrantKey;
    private String quadrantLabel;
    private String quadrantColor;
    private String topStrength;
    private String topDevelopmentArea;
    private int blindSpotCount;
    private int hiddenStrengthCount;

    public TalentMatrixDto() {}

    public TalentMatrixDto(Long employeeId, String employeeName, String employeeCode,
                           String department, String designation, String avatarUrl,
                           BigDecimal performanceScore, BigDecimal potentialScore,
                           String quadrantKey, String quadrantLabel, String quadrantColor,
                           String topStrength, String topDevelopmentArea,
                           int blindSpotCount, int hiddenStrengthCount) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeCode = employeeCode;
        this.department = department;
        this.designation = designation;
        this.avatarUrl = avatarUrl;
        this.performanceScore = performanceScore;
        this.potentialScore = potentialScore;
        this.quadrantKey = quadrantKey;
        this.quadrantLabel = quadrantLabel;
        this.quadrantColor = quadrantColor;
        this.topStrength = topStrength;
        this.topDevelopmentArea = topDevelopmentArea;
        this.blindSpotCount = blindSpotCount;
        this.hiddenStrengthCount = hiddenStrengthCount;
    }

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

    public BigDecimal getPerformanceScore() { return performanceScore; }
    public void setPerformanceScore(BigDecimal performanceScore) { this.performanceScore = performanceScore; }

    public BigDecimal getPotentialScore() { return potentialScore; }
    public void setPotentialScore(BigDecimal potentialScore) { this.potentialScore = potentialScore; }

    public String getQuadrantKey() { return quadrantKey; }
    public void setQuadrantKey(String quadrantKey) { this.quadrantKey = quadrantKey; }

    public String getQuadrantLabel() { return quadrantLabel; }
    public void setQuadrantLabel(String quadrantLabel) { this.quadrantLabel = quadrantLabel; }

    public String getQuadrantColor() { return quadrantColor; }
    public void setQuadrantColor(String quadrantColor) { this.quadrantColor = quadrantColor; }

    public String getTopStrength() { return topStrength; }
    public void setTopStrength(String topStrength) { this.topStrength = topStrength; }

    public String getTopDevelopmentArea() { return topDevelopmentArea; }
    public void setTopDevelopmentArea(String topDevelopmentArea) { this.topDevelopmentArea = topDevelopmentArea; }

    public int getBlindSpotCount() { return blindSpotCount; }
    public void setBlindSpotCount(int blindSpotCount) { this.blindSpotCount = blindSpotCount; }

    public int getHiddenStrengthCount() { return hiddenStrengthCount; }
    public void setHiddenStrengthCount(int hiddenStrengthCount) { this.hiddenStrengthCount = hiddenStrengthCount; }
}
