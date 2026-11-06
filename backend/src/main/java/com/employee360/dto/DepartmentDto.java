package com.employee360.dto;

public class DepartmentDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Long headEmployeeId;
    private String headEmployeeName;
    private boolean active;
    private int employeeCount;

    public DepartmentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getHeadEmployeeId() { return headEmployeeId; }
    public void setHeadEmployeeId(Long headEmployeeId) { this.headEmployeeId = headEmployeeId; }

    public String getHeadEmployeeName() { return headEmployeeName; }
    public void setHeadEmployeeName(String headEmployeeName) { this.headEmployeeName = headEmployeeName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(int employeeCount) { this.employeeCount = employeeCount; }
}
