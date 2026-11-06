package com.employee360.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_comments")
public class FeedbackComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "competency_id")
    private Competency competency;

    @Column(length = 50)
    private String commentType = "GENERAL"; // GENERAL, STRENGTH, IMPROVEMENT, CONFIDENTIAL_HR

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private boolean isConfidentialToHr = false;
    private boolean isModerated = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public FeedbackComment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public Competency getCompetency() { return competency; }
    public void setCompetency(Competency competency) { this.competency = competency; }

    public String getCommentType() { return commentType; }
    public void setCommentType(String commentType) { this.commentType = commentType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isConfidentialToHr() { return isConfidentialToHr; }
    public void setConfidentialToHr(boolean confidentialToHr) { isConfidentialToHr = confidentialToHr; }

    public boolean isModerated() { return isModerated; }
    public void setModerated(boolean moderated) { isModerated = moderated; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
