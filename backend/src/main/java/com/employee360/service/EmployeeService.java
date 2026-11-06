package com.employee360.service;

import com.employee360.dto.CreateEmployeeRequest;
import com.employee360.dto.EmployeeDto;
import com.employee360.entity.*;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           DesignationRepository designationRepository,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           AuditLogService auditLogService) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<EmployeeDto> searchEmployees(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return employeeRepository.findAll(pageable).map(this::toDto);
        }
        return employeeRepository.searchEmployees(search, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getDirectReports(Long managerId) {
        return employeeRepository.findByManagerId(managerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeDto createEmployee(CreateEmployeeRequest req) {
        if (employeeRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Employee email already exists: " + req.getEmail());
        }
        if (employeeRepository.findByEmployeeCode(req.getEmployeeCode()).isPresent()) {
            throw new BadRequestException("Employee code already exists: " + req.getEmployeeCode());
        }

        Employee emp = new Employee();
        emp.setEmployeeCode(req.getEmployeeCode());
        emp.setFirstName(req.getFirstName());
        emp.setLastName(req.getLastName());
        emp.setEmail(req.getEmail());
        emp.setPhone(req.getPhone());
        emp.setJoiningDate(req.getJoiningDate());
        emp.setAvatarUrl(req.getAvatarUrl());
        emp.setStatus("ACTIVE");

        if (req.getDepartmentId() != null) {
            departmentRepository.findById(req.getDepartmentId()).ifPresent(emp::setDepartment);
        }
        if (req.getDesignationId() != null) {
            designationRepository.findById(req.getDesignationId()).ifPresent(emp::setDesignation);
        }
        if (req.getManagerId() != null) {
            employeeRepository.findById(req.getManagerId()).ifPresent(emp::setManager);
        }

        // Create standard login user for employee if not exists
        String username = req.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", ".");
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(req.getEmail());
            user.setPasswordHash(passwordEncoder.encode("Password@123"));
            user.setActive(true);
            roleRepository.findByName("EMPLOYEE").ifPresent(r -> user.setRoles(Collections.singleton(r)));
            User savedUser = userRepository.save(user);
            emp.setUser(savedUser);
        }

        Employee saved = employeeRepository.save(emp);
        auditLogService.log(null, "CREATE_EMPLOYEE", "employees", saved.getId(), "Created employee " + saved.getFullName());
        return toDto(saved);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, CreateEmployeeRequest req) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        emp.setFirstName(req.getFirstName());
        emp.setLastName(req.getLastName());
        emp.setPhone(req.getPhone());
        emp.setAvatarUrl(req.getAvatarUrl());

        if (req.getDepartmentId() != null) {
            departmentRepository.findById(req.getDepartmentId()).ifPresent(emp::setDepartment);
        }
        if (req.getDesignationId() != null) {
            designationRepository.findById(req.getDesignationId()).ifPresent(emp::setDesignation);
        }
        if (req.getManagerId() != null) {
            employeeRepository.findById(req.getManagerId()).ifPresent(emp::setManager);
        }

        Employee saved = employeeRepository.save(emp);
        auditLogService.log(null, "UPDATE_EMPLOYEE", "employees", saved.getId(), "Updated employee " + saved.getFullName());
        return toDto(saved);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        emp.setStatus("RESIGNED");
        employeeRepository.save(emp);
        auditLogService.log(null, "DEACTIVATE_EMPLOYEE", "employees", id, "Deactivated employee " + emp.getFullName());
    }

    public EmployeeDto toDto(Employee e) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(e.getId());
        dto.setEmployeeCode(e.getEmployeeCode());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setFullName(e.getFullName());
        dto.setEmail(e.getEmail());
        dto.setPhone(e.getPhone());
        dto.setJoiningDate(e.getJoiningDate());
        dto.setAvatarUrl(e.getAvatarUrl());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());

        if (e.getUser() != null) {
            dto.setUserId(e.getUser().getId());
        }
        if (e.getDepartment() != null) {
            dto.setDepartmentId(e.getDepartment().getId());
            dto.setDepartmentName(e.getDepartment().getName());
        }
        if (e.getDesignation() != null) {
            dto.setDesignationId(e.getDesignation().getId());
            dto.setDesignationTitle(e.getDesignation().getTitle());
        }
        if (e.getManager() != null) {
            dto.setManagerId(e.getManager().getId());
            dto.setManagerName(e.getManager().getFullName());
        }
        return dto;
    }
}
