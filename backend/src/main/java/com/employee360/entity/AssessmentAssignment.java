package com.employee360.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"cycle_id", "employee_id"})
})
public class AssessmentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cycle_id", nullable = false)
    private AssessmentCycle cycle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(length = 50)
    private String status = "ASSIGNED"; // ASSIGNED, IN_PROGRESS, SUBMITTED, PUBLISHED, COMPLETED

    @Column(precision = 4, scale = 2)
    private BigDecimal overallScore;

    @Column(precision = 5, scale = 2)
    private BigDecimal completionRate = BigDecimal.ZERO;

    private LocalDateTime publishedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AssessmentAssignment() {}

    public AssessmentAssignment(AssessmentCycle cycle, Employee employee) {
        this.cycle = cycle;
        this.employee = employee;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AssessmentCycle getCycle() { return cycle; }
    public void setCycle(AssessmentCycle cycle) { this.cycle = cycle; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }

    public BigDecimal getCompletionRate() { return completionRate; }
    public void setCompletionRate(BigDecimal completionRate) { this.completionRate = completionRate; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
