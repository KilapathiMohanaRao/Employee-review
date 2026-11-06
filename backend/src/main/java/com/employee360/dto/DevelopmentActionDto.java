package com.employee360.dto;

import java.time.LocalDate;

public class DevelopmentActionDto {
    private Long id;
    private Long developmentPlanId;
    private String frameworkType; // EXPERIENTIAL_70, EXPOSURE_20, EDUCATION_10
    private String actionTitle;
    private String actionDescription;
    private LocalDate targetCompletionDate;
    private int progress;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED, DELAYED

    public DevelopmentActionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDevelopmentPlanId() { return developmentPlanId; }
    public void setDevelopmentPlanId(Long developmentPlanId) { this.developmentPlanId = developmentPlanId; }

    public String getFrameworkType() { return frameworkType; }
    public void setFrameworkType(String frameworkType) { this.frameworkType = frameworkType; }

    public String getActionTitle() { return actionTitle; }
    public void setActionTitle(String actionTitle) { this.actionTitle = actionTitle; }

    public String getActionDescription() { return actionDescription; }
    public void setActionDescription(String actionDescription) { this.actionDescription = actionDescription; }

    public LocalDate getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(LocalDate targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
