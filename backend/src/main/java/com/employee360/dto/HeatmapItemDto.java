package com.employee360.dto;

import java.math.BigDecimal;

public class HeatmapItemDto {
    private String department;
    private String competency;
    private BigDecimal averageScore;
    private int sampleSize;

    public HeatmapItemDto() {}

    public HeatmapItemDto(String department, String competency, BigDecimal averageScore, int sampleSize) {
        this.department = department;
        this.competency = competency;
        this.averageScore = averageScore;
        this.sampleSize = sampleSize;
    }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCompetency() { return competency; }
    public void setCompetency(String competency) { this.competency = competency; }

    public BigDecimal getAverageScore() { return averageScore; }
    public void setAverageScore(BigDecimal averageScore) { this.averageScore = averageScore; }

    public int getSampleSize() { return sampleSize; }
    public void setSampleSize(int sampleSize) { this.sampleSize = sampleSize; }
}
