package com.employee360.dto;

import java.math.BigDecimal;

public class DepartmentPerformanceDto {
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private int totalEmployees;
    private BigDecimal averageScore;
    private double completionRate;

    public DepartmentPerformanceDto() {}

    public DepartmentPerformanceDto(Long departmentId, String departmentName, String departmentCode, int totalEmployees, BigDecimal averageScore, double completionRate) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.totalEmployees = totalEmployees;
        this.averageScore = averageScore;
        this.completionRate = completionRate;
    }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public int getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(int totalEmployees) { this.totalEmployees = totalEmployees; }

    public BigDecimal getAverageScore() { return averageScore; }
    public void setAverageScore(BigDecimal averageScore) { this.averageScore = averageScore; }

    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
}
