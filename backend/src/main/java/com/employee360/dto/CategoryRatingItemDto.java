package com.employee360.dto;

public class CategoryRatingItemDto {
    private Long competencyId;
    private String competencyName;
    private String competencyCode;
    private String category;
    private Integer score; // 1 to 5
    private String comments;

    public CategoryRatingItemDto() {}

    public CategoryRatingItemDto(Long competencyId, String competencyName, String competencyCode, String category, Integer score, String comments) {
        this.competencyId = competencyId;
        this.competencyName = competencyName;
        this.competencyCode = competencyCode;
        this.category = category;
        this.score = score;
        this.comments = comments;
    }

    public Long getCompetencyId() { return competencyId; }
    public void setCompetencyId(Long competencyId) { this.competencyId = competencyId; }

    public String getCompetencyName() { return competencyName; }
    public void setCompetencyName(String competencyName) { this.competencyName = competencyName; }

    public String getCompetencyCode() { return competencyCode; }
    public void setCompetencyCode(String competencyCode) { this.competencyCode = competencyCode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
