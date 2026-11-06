package com.employee360.service;

import com.employee360.dto.DepartmentDto;
import com.employee360.dto.DesignationDto;
import com.employee360.entity.Department;
import com.employee360.entity.Designation;
import com.employee360.entity.Employee;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.DepartmentRepository;
import com.employee360.repository.DesignationRepository;
import com.employee360.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
                             DesignationRepository designationRepository,
                             EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.findByCode(dto.getCode()).isPresent()) {
            throw new BadRequestException("Department code already exists: " + dto.getCode());
        }
        Department dept = new Department(dto.getName(), dto.getCode(), dto.getDescription());
        dept.setHeadEmployeeId(dto.getHeadEmployeeId());
        dept.setActive(true);
        Department saved = departmentRepository.save(dept);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<DesignationDto> getAllDesignations() {
        return designationRepository.findAll().stream()
                .map(this::toDesignationDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DesignationDto createDesignation(DesignationDto dto) {
        Department dept = null;
        if (dto.getDepartmentId() != null) {
            dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }
        Designation desig = new Designation(dto.getTitle(), dto.getCode(), dto.getLevelGrade(), dept);
        desig.setActive(true);
        Designation saved = designationRepository.save(desig);
        return toDesignationDto(saved);
    }

    private DepartmentDto toDto(Department dept) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(dept.getId());
        dto.setName(dept.getName());
        dto.setCode(dept.getCode());
        dto.setDescription(dept.getDescription());
        dto.setHeadEmployeeId(dept.getHeadEmployeeId());
        dto.setActive(dept.isActive());

        if (dept.getHeadEmployeeId() != null) {
            employeeRepository.findById(dept.getHeadEmployeeId())
                    .ifPresent(e -> dto.setHeadEmployeeName(e.getFullName()));
        }

        List<Employee> emps = employeeRepository.findByDepartmentId(dept.getId());
        dto.setEmployeeCount(emps.size());
        return dto;
    }

    private DesignationDto toDesignationDto(Designation d) {
        DesignationDto dto = new DesignationDto();
        dto.setId(d.getId());
        dto.setTitle(d.getTitle());
        dto.setCode(d.getCode());
        dto.setLevelGrade(d.getLevelGrade());
        dto.setActive(d.isActive());
        if (d.getDepartment() != null) {
            dto.setDepartmentId(d.getDepartment().getId());
            dto.setDepartmentName(d.getDepartment().getName());
        }
        return dto;
    }
}
