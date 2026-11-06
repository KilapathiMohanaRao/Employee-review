package com.employee360.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MyAssignmentDto {
    private Long assessmentId;
    private Long assignmentId;
    private Long relationshipId;
    private String reviewType; // SELF, MANAGER, PEER, DIRECT_REPORT, CROSS_FUNCTIONAL, OTHER_STAKEHOLDER
    private boolean isAnonymous;
    private String status; // PENDING, DRAFT, SUBMITTED
    private boolean isLocked;
    private Long evaluateeEmployeeId;
    private String evaluateeName;
    private String evaluateeDepartment;
    private String evaluateeDesignation;
    private String evaluateeAvatarUrl;
    private Long cycleId;
    private String cycleTitle;
    private LocalDate deadline;
    private LocalDateTime submittedAt;

    public MyAssignmentDto() {}

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public Long getRelationshipId() { return relationshipId; }
    public void setRelationshipId(Long relationshipId) { this.relationshipId = relationshipId; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }

    public Long getEvaluateeEmployeeId() { return evaluateeEmployeeId; }
    public void setEvaluateeEmployeeId(Long evaluateeEmployeeId) { this.evaluateeEmployeeId = evaluateeEmployeeId; }

    public String getEvaluateeName() { return evaluateeName; }
    public void setEvaluateeName(String evaluateeName) { this.evaluateeName = evaluateeName; }

    public String getEvaluateeDepartment() { return evaluateeDepartment; }
    public void setEvaluateeDepartment(String evaluateeDepartment) { this.evaluateeDepartment = evaluateeDepartment; }

    public String getEvaluateeDesignation() { return evaluateeDesignation; }
    public void setEvaluateeDesignation(String evaluateeDesignation) { this.evaluateeDesignation = evaluateeDesignation; }

    public String getEvaluateeAvatarUrl() { return evaluateeAvatarUrl; }
    public void setEvaluateeAvatarUrl(String evaluateeAvatarUrl) { this.evaluateeAvatarUrl = evaluateeAvatarUrl; }

    public Long getCycleId() { return cycleId; }
    public void setCycleId(Long cycleId) { this.cycleId = cycleId; }

    public String getCycleTitle() { return cycleTitle; }
    public void setCycleTitle(String cycleTitle) { this.cycleTitle = cycleTitle; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
