package com.employee360.dto;

public class DesignationDto {
    private Long id;
    private String title;
    private String code;
    private String levelGrade;
    private Long departmentId;
    private String departmentName;
    private boolean active;

    public DesignationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLevelGrade() { return levelGrade; }
    public void setLevelGrade(String levelGrade) { this.levelGrade = levelGrade; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
