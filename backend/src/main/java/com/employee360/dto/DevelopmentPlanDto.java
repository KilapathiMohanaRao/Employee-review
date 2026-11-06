package com.employee360.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DevelopmentPlanDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long assignmentId;
    private Long focusCompetencyId;
    private String focusCompetencyName;
    private String focusCompetencyCategory;
    private BigDecimal othersAverage;
    private BigDecimal selfVsOthersGap;
    private String insightSummary;
    private String feedbackEvidence;
    private String smartGoal;
    private String mentorOrSupport;
    private String successMeasurement;
    private LocalDate targetDate;
    private int overallProgress;
    private String status;
    private List<DevelopmentActionDto> actions;
    private List<ProgressCheckinDto> checkins;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DevelopmentPlanDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public Long getFocusCompetencyId() { return focusCompetencyId; }
    public void setFocusCompetencyId(Long focusCompetencyId) { this.focusCompetencyId = focusCompetencyId; }

    public String getFocusCompetencyName() { return focusCompetencyName; }
    public void setFocusCompetencyName(String focusCompetencyName) { this.focusCompetencyName = focusCompetencyName; }

    public String getFocusCompetencyCategory() { return focusCompetencyCategory; }
    public void setFocusCompetencyCategory(String focusCompetencyCategory) { this.focusCompetencyCategory = focusCompetencyCategory; }

    public BigDecimal getOthersAverage() { return othersAverage; }
    public void setOthersAverage(BigDecimal othersAverage) { this.othersAverage = othersAverage; }

    public BigDecimal getSelfVsOthersGap() { return selfVsOthersGap; }
    public void setSelfVsOthersGap(BigDecimal selfVsOthersGap) { this.selfVsOthersGap = selfVsOthersGap; }

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

    public int getOverallProgress() { return overallProgress; }
    public void setOverallProgress(int overallProgress) { this.overallProgress = overallProgress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<DevelopmentActionDto> getActions() { return actions; }
    public void setActions(List<DevelopmentActionDto> actions) { this.actions = actions; }

    public List<ProgressCheckinDto> getCheckins() { return checkins; }
    public void setCheckins(List<ProgressCheckinDto> checkins) { this.checkins = checkins; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
