package com.employee360.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "development_actions")
public class DevelopmentAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "development_plan_id", nullable = false)
    @JsonBackReference
    private DevelopmentPlan developmentPlan;

    @Column(nullable = false, length = 30)
    private String frameworkType; // EXPERIENTIAL_70, EXPOSURE_20, EDUCATION_10

    @Column(nullable = false, length = 255)
    private String actionTitle;

    @Column(columnDefinition = "TEXT")
    private String actionDescription;

    private LocalDate targetCompletionDate;
    private int progress = 0; // 0 - 100

    @Column(length = 50)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED, DELAYED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public DevelopmentAction() {}

    public DevelopmentAction(String frameworkType, String actionTitle, String actionDescription, LocalDate targetCompletionDate) {
        this.frameworkType = frameworkType;
        this.actionTitle = actionTitle;
        this.actionDescription = actionDescription;
        this.targetCompletionDate = targetCompletionDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DevelopmentPlan getDevelopmentPlan() { return developmentPlan; }
    public void setDevelopmentPlan(DevelopmentPlan developmentPlan) { this.developmentPlan = developmentPlan; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
