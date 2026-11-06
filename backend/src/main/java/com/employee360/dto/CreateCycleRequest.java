package com.employee360.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreateCycleRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Code is required")
    private String code;

    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private boolean anonymousPeerFeedback = true;
    private boolean anonymousDirectReportFeedback = true;
    private boolean anonymousCrossFunctional = true;

    private BigDecimal weightSelf = new BigDecimal("10.00");
    private BigDecimal weightManager = new BigDecimal("35.00");
    private BigDecimal weightPeer = new BigDecimal("25.00");
    private BigDecimal weightDirectReport = new BigDecimal("15.00");
    private BigDecimal weightCrossFunctional = new BigDecimal("15.00");

    private List<Long> employeeIds;

    public CreateCycleRequest() {}

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

    public List<Long> getEmployeeIds() { return employeeIds; }
    public void setEmployeeIds(List<Long> employeeIds) { this.employeeIds = employeeIds; }
}
