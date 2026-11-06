package com.employee360.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_cycles")
public class AssessmentCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(length = 50)
    private String status = "CREATED"; // CREATED, CONFIGURED, IN_PROGRESS, SUBMITTED, REVIEW_VALIDATION, PUBLISHED, CLOSED

    private boolean anonymousPeerFeedback = true;
    private boolean anonymousDirectReportFeedback = true;
    private boolean anonymousCrossFunctional = true;

    @Column(precision = 5, scale = 2)
    private BigDecimal weightSelf = new BigDecimal("10.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal weightManager = new BigDecimal("35.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal weightPeer = new BigDecimal("25.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal weightDirectReport = new BigDecimal("15.00");

    @Column(precision = 5, scale = 2)
    private BigDecimal weightCrossFunctional = new BigDecimal("15.00");

    private Long createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AssessmentCycle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAnonymousPeerFeedback() { return anonymousPeerFeedback; }
    public void setAnonymousPeerFeedback(boolean anonymousPeerFeedback) { this.anonymousPeerFeedback = anonymousPeerFeedback; }

    public boolean isAnonymousDirectReportFeedback() { return anonymousDirectReportFeedback; }
    public void setAnonymousDirectReportFeedback(boolean anonymousDirectReportFeedback) { this.anonymousDirectReportFeedback = anonymousDirectReportFeedback; }

    public boolean isAnonymousCrossFunctional() { return anonymousCrossFunctional; }
    public void setAnonymousCrossFunctional(boolean anonymousCrossFunctional) { this.anonymousCrossFunctional = anonymousCrossFunctional; }

    public BigDecimal getWeightSelf() { return weightSelf; }
    public void setWeightSelf(BigDecimal weightSelf) { this.weightSelf = weightSelf; }

    public BigDecimal getWeightManager() { return weightManager; }
    public void setWeightManager(BigDecimal weightManager) { this.weightManager = weightManager; }

    public BigDecimal getWeightPeer() { return weightPeer; }
    public void setWeightPeer(BigDecimal weightPeer) { this.weightPeer = weightPeer; }

    public BigDecimal getWeightDirectReport() { return weightDirectReport; }
    public void setWeightDirectReport(BigDecimal weightDirectReport) { this.weightDirectReport = weightDirectReport; }

    public BigDecimal getWeightCrossFunctional() { return weightCrossFunctional; }
    public void setWeightCrossFunctional(BigDecimal weightCrossFunctional) { this.weightCrossFunctional = weightCrossFunctional; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
