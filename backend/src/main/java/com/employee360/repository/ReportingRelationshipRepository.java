package com.employee360.repository;

import com.employee360.entity.ReportingRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportingRelationshipRepository extends JpaRepository<ReportingRelationship, Long> {
    List<ReportingRelationship> findByEmployeeIdAndActiveTrue(Long employeeId);
    List<ReportingRelationship> findByManagerIdAndActiveTrue(Long managerId);
}
