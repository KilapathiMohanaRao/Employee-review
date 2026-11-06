package com.employee360.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProgressCheckinDto {
    private Long id;
    private Long developmentPlanId;
    private LocalDate checkinDate;
    private String checkinType;
    private String employeeNotes;
    private String managerFeedback;
    private Integer progressPercentage;
    private String statusAssessment;
    private Long conductedByManagerId;
    private String conductedByManagerName;
    private LocalDateTime createdAt;

    public ProgressCheckinDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDevelopmentPlanId() { return developmentPlanId; }
    public void setDevelopmentPlanId(Long developmentPlanId) { this.developmentPlanId = developmentPlanId; }

    public LocalDate getCheckinDate() { return checkinDate; }
    public void setCheckinDate(LocalDate checkinDate) { this.checkinDate = checkinDate; }

    public String getCheckinType() { return checkinType; }
    public void setCheckinType(String checkinType) { this.checkinType = checkinType; }

    public String getEmployeeNotes() { return employeeNotes; }
    public void setEmployeeNotes(String employeeNotes) { this.employeeNotes = employeeNotes; }

    public String getManagerFeedback() { return managerFeedback; }
    public void setManagerFeedback(String managerFeedback) { this.managerFeedback = managerFeedback; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public String getStatusAssessment() { return statusAssessment; }
    public void setStatusAssessment(String statusAssessment) { this.statusAssessment = statusAssessment; }

    public Long getConductedByManagerId() { return conductedByManagerId; }
    public void setConductedByManagerId(Long conductedByManagerId) { this.conductedByManagerId = conductedByManagerId; }

    public String getConductedByManagerName() { return conductedByManagerName; }
    public void setConductedByManagerName(String conductedByManagerName) { this.conductedByManagerName = conductedByManagerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
