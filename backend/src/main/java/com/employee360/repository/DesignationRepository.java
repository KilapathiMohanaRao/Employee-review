package com.employee360.repository;

import com.employee360.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {
    Optional<Designation> findByCode(String code);
    List<Designation> findByDepartmentId(Long departmentId);
    List<Designation> findByActiveTrue();
}
