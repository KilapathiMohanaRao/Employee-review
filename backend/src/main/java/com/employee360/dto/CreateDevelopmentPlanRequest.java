package com.employee360.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class CreateDevelopmentPlanRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    private Long assignmentId;

    @NotNull(message = "Focus competency ID is required")
    private Long focusCompetencyId;

    private String insightSummary;
    private String feedbackEvidence;

    @NotBlank(message = "SMART goal is required")
    private String smartGoal;

    private String mentorOrSupport;
    private String successMeasurement;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;

    private List<DevelopmentActionDto> actions;

    public CreateDevelopmentPlanRequest() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public Long getFocusCompetencyId() { return focusCompetencyId; }
    public void setFocusCompetencyId(Long focusCompetencyId) { this.focusCompetencyId = focusCompetencyId; }

    public String getInsightSummary() { return insightSummary; }
    public void setInsightSummary(String insightSummary) { this.insightSummary = insightSummary; }

    public String getFeedbackEvidence() { return feedbackEvidence; }
    public void setFeedbackEvidence(String feedbackEvidence) { this.feedbackEvidence = feedbackEvidence; }

    public String getSmartGoal() { return smartGoal; }
    public void setSmartGoal(String smartGoal) { this.smartGoal = smartGoal; }

    public String getMentorOrSupport() { return mentorOrSupport; }
    public void setMentorOrSupport(String mentorOrSupport) { this.mentorOrSupport = mentorOrSupport; }

    public String getSuccessMeasurement() { return successMeasurement; }
    public void setSuccessMeasurement(String successMeasurement) { this.successMeasurement = successMeasurement; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public List<DevelopmentActionDto> getActions() { return actions; }
    public void setActions(List<DevelopmentActionDto> actions) { this.actions = actions; }
}
