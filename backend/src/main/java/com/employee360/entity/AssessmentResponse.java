package com.employee360.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_responses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"assessment_id", "behaviour_id"})
})
public class AssessmentResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    @JsonBackReference
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "behaviour_id", nullable = false)
    private Behaviour behaviour;

    private Integer score; // 1 to 5, or null if not observed

    private boolean isNotObserved = false;

    @Column(columnDefinition = "TEXT")
    private String comments;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AssessmentResponse() {}

    public AssessmentResponse(Assessment assessment, Behaviour behaviour, Integer score, boolean isNotObserved, String comments) {
        this.assessment = assessment;
        this.behaviour = behaviour;
        this.score = score;
        this.isNotObserved = isNotObserved;
        this.comments = comments;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }

    public Behaviour getBehaviour() { return behaviour; }
    public void setBehaviour(Behaviour behaviour) { this.behaviour = behaviour; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public boolean isNotObserved() { return isNotObserved; }
    public void setNotObserved(boolean notObserved) { isNotObserved = notObserved; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
