package com.employee360.dto;

import java.util.List;

public class CompetencyDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private String category;
    private int sortOrder;
    private boolean active;
    private List<BehaviourDto> behaviours;

    public CompetencyDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<BehaviourDto> getBehaviours() { return behaviours; }
    public void setBehaviours(List<BehaviourDto> behaviours) { this.behaviours = behaviours; }
}
