package com.employee360.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssessmentCycleDto {
    private Long id;
    private String title;
    private String code;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private boolean anonymousPeerFeedback;
    private boolean anonymousDirectReportFeedback;
    private boolean anonymousCrossFunctional;
    private BigDecimal weightSelf;
    private BigDecimal weightManager;
    private BigDecimal weightPeer;
    private BigDecimal weightDirectReport;
    private BigDecimal weightCrossFunctional;
    private int totalEmployees;
    private int completedAssessments;
    private double completionPercentage;
    private LocalDateTime createdAt;

    public AssessmentCycleDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAnonymousPeerFeedback() { return anonymousPeerFeedback; }
    public void setAnonymousPeerFeedback(boolean anonymousPeerFeedback) { this.anonymousPeerFeedback = anonymousPeerFeedback; }

    public boolean isAnonymousDirectReportFeedback() { return anonymousDirectReportFeedback; }
    public void setAnonymousDirectReportFeedback(boolean anonymousDirectReportFeedback) { this.anonymousDirectReportFeedback = anonymousDirectReportFeedback; }

    public boolean isAnonymousCrossFunctional() { return anonymousCrossFunctional; }
    public void setAnonymousCrossFunctional(boolean anonymousCrossFunctional) { this.anonymousCrossFunctional = anonymousCrossFunctional; }

    public BigDecimal getWeightSelf() { return weightSelf; }
    public void setWeightSelf(BigDecimal weightSelf) { this.weightSelf = weightSelf; }

    public BigDecimal getWeightManager() { return weightManager; }
    public void setWeightManager(BigDecimal weightManager) { this.weightManager = weightManager; }

    public BigDecimal getWeightPeer() { return weightPeer; }
    public void setWeightPeer(BigDecimal weightPeer) { this.weightPeer = weightPeer; }

    public BigDecimal getWeightDirectReport() { return weightDirectReport; }
    public void setWeightDirectReport(BigDecimal weightDirectReport) { this.weightDirectReport = weightDirectReport; }

    public BigDecimal getWeightCrossFunctional() { return weightCrossFunctional; }
    public void setWeightCrossFunctional(BigDecimal weightCrossFunctional) { this.weightCrossFunctional = weightCrossFunctional; }

    public int getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(int totalEmployees) { this.totalEmployees = totalEmployees; }

    public int getCompletedAssessments() { return completedAssessments; }
    public void setCompletedAssessments(int completedAssessments) { this.completedAssessments = completedAssessments; }

    public double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(double completionPercentage) { this.completionPercentage = completionPercentage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
