package com.employee360.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateCheckinRequest {
    @NotNull(message = "Check-in date is required")
    private LocalDate checkinDate;

    private String checkinType; // FOUR_WEEK, SIX_WEEK, QUARTERLY, AD_HOC
    private String employeeNotes;
    private String managerFeedback;
    private Integer progressPercentage;
    private String statusAssessment; // ON_TRACK, AT_RISK, COMPLETED, NEEDS_SUPPORT

    public CreateCheckinRequest() {}

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
}
