package com.employee360.repository;

import com.employee360.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    Optional<Assessment> findByReviewerRelationshipId(Long reviewerRelationshipId);
    List<Assessment> findByAssignmentId(Long assignmentId);
    List<Assessment> findByAssignmentIdAndStatus(Long assignmentId, String status);

    @Query("SELECT a FROM Assessment a WHERE a.status = 'SUBMITTED' ORDER BY a.submittedAt DESC")
    List<Assessment> findAllSubmittedAssessments();

    @Query("SELECT a FROM Assessment a WHERE a.reviewerRelationship.reviewer.id = :reviewerId AND a.assignment.employee.id = :evaluateeId AND a.assignment.cycle.id = :cycleId AND a.status = 'SUBMITTED'")
    List<Assessment> findSubmittedByReviewerAndEvaluateeAndCycle(
            @Param("reviewerId") Long reviewerId,
            @Param("evaluateeId") Long evaluateeId,
            @Param("cycleId") Long cycleId);
}
