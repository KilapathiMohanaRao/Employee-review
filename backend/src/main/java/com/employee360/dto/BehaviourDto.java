package com.employee360.dto;

public class BehaviourDto {
    private Long id;
    private Long competencyId;
    private String title;
    private String description;
    private int sortOrder;
    private boolean active;

    public BehaviourDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompetencyId() { return competencyId; }
    public void setCompetencyId(Long competencyId) { this.competencyId = competencyId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
