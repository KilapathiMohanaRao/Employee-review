package com.employee360.dto;

import java.math.BigDecimal;

public class BlindSpotHiddenStrengthDto {
    private Long competencyId;
    private String competencyName;
    private BigDecimal selfScore;
    private BigDecimal othersScore;
    private BigDecimal gap;
    private String nature; // BLIND_SPOT (Self > Others), HIDDEN_STRENGTH (Others > Self)
    private String advice;

    public BlindSpotHiddenStrengthDto() {}

    public BlindSpotHiddenStrengthDto(Long competencyId, String competencyName, BigDecimal selfScore, BigDecimal othersScore, BigDecimal gap, String nature, String advice) {
        this.competencyId = competencyId;
        this.competencyName = competencyName;
        this.selfScore = selfScore;
        this.othersScore = othersScore;
        this.gap = gap;
        this.nature = nature;
        this.advice = advice;
    }

    public Long getCompetencyId() { return competencyId; }
    public void setCompetencyId(Long competencyId) { this.competencyId = competencyId; }

    public String getCompetencyName() { return competencyName; }
    public void setCompetencyName(String competencyName) { this.competencyName = competencyName; }

    public BigDecimal getSelfScore() { return selfScore; }
    public void setSelfScore(BigDecimal selfScore) { this.selfScore = selfScore; }

    public BigDecimal getOthersScore() { return othersScore; }
    public void setOthersScore(BigDecimal othersScore) { this.othersScore = othersScore; }

    public BigDecimal getGap() { return gap; }
    public void setGap(BigDecimal gap) { this.gap = gap; }

    public String getNature() { return nature; }
    public void setNature(String nature) { this.nature = nature; }

    public String getAdvice() { return advice; }
    public void setAdvice(String advice) { this.advice = advice; }
}
