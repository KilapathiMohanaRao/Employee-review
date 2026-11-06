package com.employee360.repository;

import com.employee360.entity.Behaviour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BehaviourRepository extends JpaRepository<Behaviour, Long> {
    List<Behaviour> findByCompetencyIdAndActiveTrueOrderBySortOrderAsc(Long competencyId);
}
