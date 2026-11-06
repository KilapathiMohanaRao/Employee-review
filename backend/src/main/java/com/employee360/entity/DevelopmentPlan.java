package com.employee360.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "development_plans")
public class DevelopmentPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private AssessmentAssignment assignment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "focus_competency_id", nullable = false)
    private Competency focusCompetency;

    @Column(precision = 4, scale = 2)
    private BigDecimal othersAverage;

    @Column(precision = 4, scale = 2)
    private BigDecimal selfVsOthersGap;

    @Column(length = 255)
    private String insightSummary;

    @Column(columnDefinition = "TEXT")
    private String feedbackEvidence;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String smartGoal;

    @Column(length = 150)
    private String mentorOrSupport;

    @Column(columnDefinition = "TEXT")
    private String successMeasurement;

    @Column(nullable = false)
    private LocalDate targetDate;

    private int overallProgress = 0; // 0 - 100

    @Column(length = 50)
    private String status = "DRAFT"; // DRAFT, ACTIVE, IN_REVIEW, COMPLETED, CANCELLED

    private Long createdBy;

    @OneToMany(mappedBy = "developmentPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<DevelopmentAction> actions = new ArrayList<>();

    @OneToMany(mappedBy = "developmentPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProgressCheckin> checkins = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public DevelopmentPlan() {}

    public void addAction(DevelopmentAction action) {
        actions.add(action);
        action.setDevelopmentPlan(this);
    }

    public void addCheckin(ProgressCheckin checkin) {
        checkins.add(checkin);
        checkin.setDevelopmentPlan(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public AssessmentAssignment getAssignment() { return assignment; }
    public void setAssignment(AssessmentAssignment assignment) { this.assignment = assignment; }

    public Competency getFocusCompetency() { return focusCompetency; }
    public void setFocusCompetency(Competency focusCompetency) { this.focusCompetency = focusCompetency; }

    public BigDecimal getOthersAverage() { return othersAverage; }
    public void setOthersAverage(BigDecimal othersAverage) { this.othersAverage = othersAverage; }

    public BigDecimal getSelfVsOthersGap() { return selfVsOthersGap; }
    public void setSelfVsOthersGap(BigDecimal selfVsOthersGap) { this.selfVsOthersGap = selfVsOthersGap; }

    public String getInsightSummary() { return insightSummary; }
    public void setInsightSummary(String insightSummary) { this.insightSummary = insightSummary; }

    public String getFeedbackEvidence() { return feedbackEvidence; }
    public void setFeedbackEvidence(String feedbackEvidence) { this.feedbackEvidence = feedbackEvidence; }

    public String getSmartGoal() { return smartGoal; }
    public void setSmartGoal(String smartGoal) { this.smartGoal = smartGoal; }

    public String getMentorOrSupport() { return mentorOrSupport; }
    public void setMentorOrSupport(String mentorOrSupport) { this.mentorOrSupport = mentorOrSupport; }

    public String getSuccessMeasurement() { return successMeasurement; }
    public void setSuccessMeasurement(String successMeasurement) { this.successMeasurement = successMeasurement; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public int getOverallProgress() { return overallProgress; }
    public void setOverallProgress(int overallProgress) { this.overallProgress = overallProgress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public List<DevelopmentAction> getActions() { return actions; }
    public void setActions(List<DevelopmentAction> actions) { this.actions = actions; }

    public List<ProgressCheckin> getCheckins() { return checkins; }
    public void setCheckins(List<ProgressCheckin> checkins) { this.checkins = checkins; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
