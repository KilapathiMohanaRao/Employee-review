package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class TalentMatrixResponseDto {
    private List<TalentMatrixDto> employees;
    private int totalEmployees;
    private Map<String, Integer> quadrantSummary;
    private BigDecimal averagePerformance;
    private BigDecimal averagePotential;

    public TalentMatrixResponseDto() {}

    public TalentMatrixResponseDto(List<TalentMatrixDto> employees, int totalEmployees,
                                   Map<String, Integer> quadrantSummary,
                                   BigDecimal averagePerformance, BigDecimal averagePotential) {
        this.employees = employees;
        this.totalEmployees = totalEmployees;
        this.quadrantSummary = quadrantSummary;
        this.averagePerformance = averagePerformance;
        this.averagePotential = averagePotential;
    }

    public List<TalentMatrixDto> getEmployees() { return employees; }
    public void setEmployees(List<TalentMatrixDto> employees) { this.employees = employees; }

    public int getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(int totalEmployees) { this.totalEmployees = totalEmployees; }

    public Map<String, Integer> getQuadrantSummary() { return quadrantSummary; }
    public void setQuadrantSummary(Map<String, Integer> quadrantSummary) { this.quadrantSummary = quadrantSummary; }

    public BigDecimal getAveragePerformance() { return averagePerformance; }
    public void setAveragePerformance(BigDecimal averagePerformance) { this.averagePerformance = averagePerformance; }

    public BigDecimal getAveragePotential() { return averagePotential; }
    public void setAveragePotential(BigDecimal averagePotential) { this.averagePotential = averagePotential; }
}
