package com.employee360.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentDetailDto {
    private Long id;
    private Long assignmentId;
    private Long relationshipId;
    private String reviewType; // SELF, MANAGER, PEER, etc.
    private boolean isAnonymous;
    private String status; // DRAFT, SUBMITTED, LOCKED
    private boolean isLocked;
    private Long evaluateeEmployeeId;
    private String evaluateeName;
    private String evaluateeDepartment;
    private String evaluateeDesignation;
    private String cycleTitle;
    private String summaryFeedback;
    private String keyStrengthsComment;
    private String developmentAreasComment;
    private List<ResponseItemDto> responses;
    private LocalDateTime submittedAt;

    public AssessmentDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getCycleTitle() { return cycleTitle; }
    public void setCycleTitle(String cycleTitle) { this.cycleTitle = cycleTitle; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getKeyStrengthsComment() { return keyStrengthsComment; }
    public void setKeyStrengthsComment(String keyStrengthsComment) { this.keyStrengthsComment = keyStrengthsComment; }

    public String getDevelopmentAreasComment() { return developmentAreasComment; }
    public void setDevelopmentAreasComment(String developmentAreasComment) { this.developmentAreasComment = developmentAreasComment; }

    public List<ResponseItemDto> getResponses() { return responses; }
    public void setResponses(List<ResponseItemDto> responses) { this.responses = responses; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
