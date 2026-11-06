package com.employee360.repository;

import com.employee360.entity.AssessmentCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentCycleRepository extends JpaRepository<AssessmentCycle, Long> {
    Optional<AssessmentCycle> findByCode(String code);
    List<AssessmentCycle> findByStatus(String status);
    List<AssessmentCycle> findAllByOrderByCreatedAtDesc();
}
