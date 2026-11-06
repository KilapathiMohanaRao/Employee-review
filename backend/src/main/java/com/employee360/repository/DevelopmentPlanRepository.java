package com.employee360.repository;

import com.employee360.entity.DevelopmentPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevelopmentPlanRepository extends JpaRepository<DevelopmentPlan, Long> {
    List<DevelopmentPlan> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<DevelopmentPlan> findByStatus(String status);

    @Query("SELECT dp FROM DevelopmentPlan dp WHERE dp.employee.manager.id = :managerId ORDER BY dp.createdAt DESC")
    List<DevelopmentPlan> findTeamDevelopmentPlans(@Param("managerId") Long managerId);
}
