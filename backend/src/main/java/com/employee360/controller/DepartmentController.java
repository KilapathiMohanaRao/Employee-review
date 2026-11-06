package com.employee360.controller;

import com.employee360.dto.ApiResponse;
import com.employee360.dto.DepartmentDto;
import com.employee360.dto.DesignationDto;
import com.employee360.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllDepartments()));
    }

    @GetMapping("/departments/{id}")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getDepartmentById(id)));
    }

    @PostMapping("/departments")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(@Valid @RequestBody DepartmentDto dto) {
        DepartmentDto created = departmentService.createDepartment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Department created successfully", created));
    }

    @GetMapping("/designations")
    public ResponseEntity<ApiResponse<List<DesignationDto>>> getAllDesignations() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllDesignations()));
    }

    @PostMapping("/designations")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<DesignationDto>> createDesignation(@Valid @RequestBody DesignationDto dto) {
        DesignationDto created = departmentService.createDesignation(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Designation created successfully", created));
    }
}
