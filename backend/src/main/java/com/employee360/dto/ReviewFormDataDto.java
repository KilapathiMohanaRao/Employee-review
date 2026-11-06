package com.employee360.dto;

import java.util.List;

public class ReviewFormDataDto {
    private List<EmployeeDto> evaluatees;
    private List<CompetencyDto> ratingCategories;
    private AssessmentCycleDto activeCycle;

    public ReviewFormDataDto() {}

    public ReviewFormDataDto(List<EmployeeDto> evaluatees, List<CompetencyDto> ratingCategories, AssessmentCycleDto activeCycle) {
        this.evaluatees = evaluatees;
        this.ratingCategories = ratingCategories;
        this.activeCycle = activeCycle;
    }

    public List<EmployeeDto> getEvaluatees() { return evaluatees; }
    public void setEvaluatees(List<EmployeeDto> evaluatees) { this.evaluatees = evaluatees; }

    public List<CompetencyDto> getRatingCategories() { return ratingCategories; }
    public void setRatingCategories(List<CompetencyDto> ratingCategories) { this.ratingCategories = ratingCategories; }

    public AssessmentCycleDto getActiveCycle() { return activeCycle; }
    public void setActiveCycle(AssessmentCycleDto activeCycle) { this.activeCycle = activeCycle; }
}
