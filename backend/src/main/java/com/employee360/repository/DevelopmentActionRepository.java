package com.employee360.repository;

import com.employee360.entity.DevelopmentAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevelopmentActionRepository extends JpaRepository<DevelopmentAction, Long> {
    List<DevelopmentAction> findByDevelopmentPlanId(Long developmentPlanId);
}
