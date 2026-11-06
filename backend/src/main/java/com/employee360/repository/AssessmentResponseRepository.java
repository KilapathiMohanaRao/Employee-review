package com.employee360.repository;

import com.employee360.entity.AssessmentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentResponseRepository extends JpaRepository<AssessmentResponse, Long> {
    List<AssessmentResponse> findByAssessmentId(Long assessmentId);
    Optional<AssessmentResponse> findByAssessmentIdAndBehaviourId(Long assessmentId, Long behaviourId);

    @Modifying
    @Query("DELETE FROM AssessmentResponse r WHERE r.assessment.id = :assessmentId")
    void deleteByAssessmentId(@Param("assessmentId") Long assessmentId);

    @Query("SELECT r FROM AssessmentResponse r WHERE r.assessment.assignment.id = :assignmentId")
    List<AssessmentResponse> findAllResponsesForAssignment(@Param("assignmentId") Long assignmentId);

    @Query("SELECT r FROM AssessmentResponse r WHERE r.assessment.assignment.id = :assignmentId AND r.behaviour.competency.id = :competencyId")
    List<AssessmentResponse> findResponsesByAssignmentAndCompetency(
        @Param("assignmentId") Long assignmentId,
        @Param("competencyId") Long competencyId
    );
}
