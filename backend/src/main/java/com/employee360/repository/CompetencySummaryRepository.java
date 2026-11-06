package com.employee360.repository;

import com.employee360.entity.CompetencySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencySummaryRepository extends JpaRepository<CompetencySummary, Long> {
    List<CompetencySummary> findByAssignmentIdOrderByCompetencyRankAsc(Long assignmentId);
    List<CompetencySummary> findByAssignmentIdOrderByOthersAverageDesc(Long assignmentId);
    Optional<CompetencySummary> findByAssignmentIdAndCompetencyId(Long assignmentId, Long competencyId);

    @Query("SELECT cs FROM CompetencySummary cs WHERE cs.assignment.employee.id = :employeeId ORDER BY cs.calculatedAt DESC")
    List<CompetencySummary> findLatestSummariesByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT cs FROM CompetencySummary cs WHERE cs.assignment.employee.department.id = :departmentId AND cs.assignment.cycle.id = :cycleId")
    List<CompetencySummary> findByDepartmentAndCycle(@Param("departmentId") Long departmentId, @Param("cycleId") Long cycleId);
}
