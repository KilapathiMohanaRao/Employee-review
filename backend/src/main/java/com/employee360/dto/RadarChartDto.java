package com.employee360.dto;

import java.math.BigDecimal;

public class RadarChartDto {
    private String competency;
    private String code;
    private BigDecimal selfScore;
    private BigDecimal managerScore;
    private BigDecimal othersScore;
    private BigDecimal benchmark; // e.g. 4.0

    public RadarChartDto() {}

    public RadarChartDto(String competency, String code, BigDecimal selfScore, BigDecimal managerScore, BigDecimal othersScore, BigDecimal benchmark) {
        this.competency = competency;
        this.code = code;
        this.selfScore = selfScore;
        this.managerScore = managerScore;
        this.othersScore = othersScore;
        this.benchmark = benchmark;
    }

    public String getCompetency() { return competency; }
    public void setCompetency(String competency) { this.competency = competency; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getSelfScore() { return selfScore; }
    public void setSelfScore(BigDecimal selfScore) { this.selfScore = selfScore; }

    public BigDecimal getManagerScore() { return managerScore; }
    public void setManagerScore(BigDecimal managerScore) { this.managerScore = managerScore; }

    public BigDecimal getOthersScore() { return othersScore; }
    public void setOthersScore(BigDecimal othersScore) { this.othersScore = othersScore; }

    public BigDecimal getBenchmark() { return benchmark; }
    public void setBenchmark(BigDecimal benchmark) { this.benchmark = benchmark; }
}
