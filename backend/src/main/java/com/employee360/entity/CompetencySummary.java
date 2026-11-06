package com.employee360.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "competency_summaries", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"assignment_id", "competency_id"})
})
public class CompetencySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private AssessmentAssignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "competency_id", nullable = false)
    private Competency competency;

    private int itemCount = 0;

    @Column(precision = 4, scale = 2)
    private BigDecimal selfScore;

    @Column(precision = 4, scale = 2)
    private BigDecimal managerScore;

    @Column(precision = 4, scale = 2)
    private BigDecimal peerScore;

    @Column(precision = 4, scale = 2)
    private BigDecimal directReportScore;

    @Column(precision = 4, scale = 2)
    private BigDecimal crossFunctionalScore;

    @Column(precision = 4, scale = 2)
    private BigDecimal otherStakeholderScore;

    @Column(precision = 4, scale = 2)
    private BigDecimal othersAverage;

    @Column(precision = 4, scale = 2)
    private BigDecimal gapScore; // selfScore - othersAverage

    private Integer competencyRank;

    @Column(length = 100)
    private String performanceInsight; // ON_TRACK, NEEDS_IMPROVEMENT, BLIND_SPOT, HIDDEN_STRENGTH, INSUFFICIENT_FEEDBACK

    private LocalDateTime calculatedAt = LocalDateTime.now();

    public CompetencySummary() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AssessmentAssignment getAssignment() { return assignment; }
    public void setAssignment(AssessmentAssignment assignment) { this.assignment = assignment; }

    public Competency getCompetency() { return competency; }
    public void setCompetency(Competency competency) { this.competency = competency; }

    public int getItemCount() { return itemCount; }
    public void setItemCount(int itemCount) { this.itemCount = itemCount; }

    public BigDecimal getSelfScore() { return selfScore; }
    public void setSelfScore(BigDecimal selfScore) { this.selfScore = selfScore; }

    public BigDecimal getManagerScore() { return managerScore; }
    public void setManagerScore(BigDecimal managerScore) { this.managerScore = managerScore; }

    public BigDecimal getPeerScore() { return peerScore; }
    public void setPeerScore(BigDecimal peerScore) { this.peerScore = peerScore; }

    public BigDecimal getDirectReportScore() { return directReportScore; }
    public void setDirectReportScore(BigDecimal directReportScore) { this.directReportScore = directReportScore; }

    public BigDecimal getCrossFunctionalScore() { return crossFunctionalScore; }
    public void setCrossFunctionalScore(BigDecimal crossFunctionalScore) { this.crossFunctionalScore = crossFunctionalScore; }

    public BigDecimal getOtherStakeholderScore() { return otherStakeholderScore; }
    public void setOtherStakeholderScore(BigDecimal otherStakeholderScore) { this.otherStakeholderScore = otherStakeholderScore; }

    public BigDecimal getOthersAverage() { return othersAverage; }
    public void setOthersAverage(BigDecimal othersAverage) { this.othersAverage = othersAverage; }

    public BigDecimal getGapScore() { return gapScore; }
    public void setGapScore(BigDecimal gapScore) { this.gapScore = gapScore; }

    public Integer getCompetencyRank() { return competencyRank; }
    public void setCompetencyRank(Integer competencyRank) { this.competencyRank = competencyRank; }

    public String getPerformanceInsight() { return performanceInsight; }
    public void setPerformanceInsight(String performanceInsight) { this.performanceInsight = performanceInsight; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}
