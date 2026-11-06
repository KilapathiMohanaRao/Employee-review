package com.employee360.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_checkins")
public class ProgressCheckin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "development_plan_id", nullable = false)
    @JsonBackReference
    private DevelopmentPlan developmentPlan;

    @Column(nullable = false)
    private LocalDate checkinDate = LocalDate.now();

    @Column(length = 50)
    private String checkinType = "FOUR_WEEK"; // FOUR_WEEK, SIX_WEEK, QUARTERLY, AD_HOC

    @Column(columnDefinition = "TEXT")
    private String employeeNotes;

    @Column(columnDefinition = "TEXT")
    private String managerFeedback;

    private Integer progressPercentage;

    @Column(length = 50)
    private String statusAssessment = "ON_TRACK"; // ON_TRACK, AT_RISK, COMPLETED, NEEDS_SUPPORT

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "conducted_by_manager_id")
    private Employee conductedByManager;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ProgressCheckin() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DevelopmentPlan getDevelopmentPlan() { return developmentPlan; }
    public void setDevelopmentPlan(DevelopmentPlan developmentPlan) { this.developmentPlan = developmentPlan; }

    public LocalDate getCheckinDate() { return checkinDate; }
    public void setCheckinDate(LocalDate checkinDate) { this.checkinDate = checkinDate; }

    public String getCheckinType() { return checkinType; }
    public void setCheckinType(String checkinType) { this.checkinType = checkinType; }

    public String getEmployeeNotes() { return employeeNotes; }
    public void setEmployeeNotes(String employeeNotes) { this.employeeNotes = employeeNotes; }

    public String getManagerFeedback() { return managerFeedback; }
    public void setManagerFeedback(String managerFeedback) { this.managerFeedback = managerFeedback; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public String getStatusAssessment() { return statusAssessment; }
    public void setStatusAssessment(String statusAssessment) { this.statusAssessment = statusAssessment; }

    public Employee getConductedByManager() { return conductedByManager; }
    public void setConductedByManager(Employee conductedByManager) { this.conductedByManager = conductedByManager; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
