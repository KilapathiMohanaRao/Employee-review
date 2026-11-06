package com.employee360.dto;

import java.math.BigDecimal;

public class StrengthDevelopmentDto {
    private Long behaviourId;
    private String behaviourTitle;
    private String competencyName;
    private BigDecimal score;
    private BigDecimal selfScore;
    private String type; // STRENGTH, DEVELOPMENT_AREA

    public StrengthDevelopmentDto() {}

    public StrengthDevelopmentDto(Long behaviourId, String behaviourTitle, String competencyName, BigDecimal score, BigDecimal selfScore, String type) {
        this.behaviourId = behaviourId;
        this.behaviourTitle = behaviourTitle;
        this.competencyName = competencyName;
        this.score = score;
        this.selfScore = selfScore;
        this.type = type;
    }

    public Long getBehaviourId() { return behaviourId; }
    public void setBehaviourId(Long behaviourId) { this.behaviourId = behaviourId; }

    public String getBehaviourTitle() { return behaviourTitle; }
    public void setBehaviourTitle(String behaviourTitle) { this.behaviourTitle = behaviourTitle; }

    public String getCompetencyName() { return competencyName; }
    public void setCompetencyName(String competencyName) { this.competencyName = competencyName; }

    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }

    public BigDecimal getSelfScore() { return selfScore; }
    public void setSelfScore(BigDecimal selfScore) { this.selfScore = selfScore; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
