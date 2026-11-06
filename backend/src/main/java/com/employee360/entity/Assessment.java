package com.employee360.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private AssessmentAssignment assignment;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_relationship_id", nullable = false, unique = true)
    private ReviewerRelationship reviewerRelationship;

    @Column(length = 50)
    private String status = "DRAFT"; // DRAFT, SUBMITTED, LOCKED, REOPENED

    private LocalDateTime submittedAt;
    private boolean isLocked = false;

    @Column(columnDefinition = "TEXT")
    private String summaryFeedback;

    @Column(columnDefinition = "TEXT")
    private String keyStrengthsComment;

    @Column(columnDefinition = "TEXT")
    private String developmentAreasComment;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<AssessmentResponse> responses = new ArrayList<>();

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<FeedbackComment> comments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Assessment() {}

    public Assessment(AssessmentAssignment assignment, ReviewerRelationship reviewerRelationship) {
        this.assignment = assignment;
        this.reviewerRelationship = reviewerRelationship;
    }

    public void addResponse(AssessmentResponse response) {
        responses.add(response);
        response.setAssessment(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AssessmentAssignment getAssignment() { return assignment; }
    public void setAssignment(AssessmentAssignment assignment) { this.assignment = assignment; }

    public ReviewerRelationship getReviewerRelationship() { return reviewerRelationship; }
    public void setReviewerRelationship(ReviewerRelationship reviewerRelationship) { this.reviewerRelationship = reviewerRelationship; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getKeyStrengthsComment() { return keyStrengthsComment; }
    public void setKeyStrengthsComment(String keyStrengthsComment) { this.keyStrengthsComment = keyStrengthsComment; }

    public String getDevelopmentAreasComment() { return developmentAreasComment; }
    public void setDevelopmentAreasComment(String developmentAreasComment) { this.developmentAreasComment = developmentAreasComment; }

    public List<AssessmentResponse> getResponses() { return responses; }
    public void setResponses(List<AssessmentResponse> responses) { this.responses = responses; }

    public List<FeedbackComment> getComments() { return comments; }
    public void setComments(List<FeedbackComment> comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
