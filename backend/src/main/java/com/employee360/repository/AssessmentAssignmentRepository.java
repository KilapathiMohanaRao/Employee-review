package com.employee360.repository;

import com.employee360.entity.AssessmentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentAssignmentRepository extends JpaRepository<AssessmentAssignment, Long> {
    List<AssessmentAssignment> findByCycleId(Long cycleId);
    List<AssessmentAssignment> findByEmployeeId(Long employeeId);
    Optional<AssessmentAssignment> findByCycleIdAndEmployeeId(Long cycleId, Long employeeId);

    @Query("SELECT a FROM AssessmentAssignment a WHERE a.employee.department.id = :departmentId AND a.cycle.id = :cycleId")
    List<AssessmentAssignment> findByDepartmentAndCycle(@Param("departmentId") Long departmentId, @Param("cycleId") Long cycleId);

    @Query("SELECT COUNT(a) FROM AssessmentAssignment a WHERE a.status = 'COMPLETED' OR a.status = 'PUBLISHED'")
    long countCompletedAssignments();

    @Query("SELECT COUNT(a) FROM AssessmentAssignment a WHERE a.status = 'IN_PROGRESS' OR a.status = 'ASSIGNED'")
    long countPendingAssignments();
}
