package com.employee360.dto;

import java.math.BigDecimal;

public class CompetencyScorecardDto {
    private Long competencyId;
    private String competencyName;
    private String competencyCode;
    private String category;
    private int itemCount;
    private BigDecimal selfScore;
    private BigDecimal managerScore;
    private BigDecimal peerScore;
    private BigDecimal directReportScore;
    private BigDecimal crossFunctionalScore;
    private BigDecimal otherStakeholderScore;
    private BigDecimal othersAverage;
    private BigDecimal gapScore; // selfScore - othersAverage
    private Integer ranking;
    private String performanceInsight; // ON_TRACK, NEEDS_IMPROVEMENT, BLIND_SPOT, HIDDEN_STRENGTH, INSUFFICIENT_FEEDBACK

    public CompetencyScorecardDto() {}

    public Long getCompetencyId() { return competencyId; }
    public void setCompetencyId(Long competencyId) { this.competencyId = competencyId; }

    public String getCompetencyName() { return competencyName; }
    public void setCompetencyName(String competencyName) { this.competencyName = competencyName; }

    public String getCompetencyCode() { return competencyCode; }
    public void setCompetencyCode(String competencyCode) { this.competencyCode = competencyCode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

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

    public Integer getRanking() { return ranking; }
    public void setRanking(Integer ranking) { this.ranking = ranking; }

    public String getPerformanceInsight() { return performanceInsight; }
    public void setPerformanceInsight(String performanceInsight) { this.performanceInsight = performanceInsight; }
}
