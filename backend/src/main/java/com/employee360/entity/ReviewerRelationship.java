package com.employee360.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviewer_relationships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"assignment_id", "reviewer_id", "review_type"})
})
public class ReviewerRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignment_id", nullable = false)
    private AssessmentAssignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Employee reviewer;

    @Column(nullable = false, length = 50)
    private String reviewType; // SELF, MANAGER, PEER, DIRECT_REPORT, CROSS_FUNCTIONAL, OTHER_STAKEHOLDER

    private boolean isAnonymous = false;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight = BigDecimal.ONE;

    @Column(length = 50)
    private String status = "PENDING"; // PENDING, DRAFT, SUBMITTED, DECLINED, EXPIRED

    private Long assignedBy;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ReviewerRelationship() {}

    public ReviewerRelationship(AssessmentAssignment assignment, Employee reviewer, String reviewType, boolean isAnonymous) {
        this.assignment = assignment;
        this.reviewer = reviewer;
        this.reviewType = reviewType;
        this.isAnonymous = isAnonymous;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AssessmentAssignment getAssignment() { return assignment; }
    public void setAssignment(AssessmentAssignment assignment) { this.assignment = assignment; }

    public Employee getReviewer() { return reviewer; }
    public void setReviewer(Employee reviewer) { this.reviewer = reviewer; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Long assignedBy) { this.assignedBy = assignedBy; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
