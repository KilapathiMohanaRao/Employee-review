package com.employee360.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private Long employeeId;
    private String fullName;
    private String departmentName;
    private String designationTitle;
    private Set<String> roles;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String username, String email, Long employeeId,
                        String fullName, String departmentName, String designationTitle, Set<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.departmentName = departmentName;
        this.designationTitle = designationTitle;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDesignationTitle() { return designationTitle; }
    public void setDesignationTitle(String designationTitle) { this.designationTitle = designationTitle; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
