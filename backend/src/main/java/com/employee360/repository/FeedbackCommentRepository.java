package com.employee360.repository;

import com.employee360.entity.FeedbackComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackCommentRepository extends JpaRepository<FeedbackComment, Long> {
    List<FeedbackComment> findByAssessmentId(Long assessmentId);

    @Query("SELECT c FROM FeedbackComment c WHERE c.assessment.assignment.id = :assignmentId AND c.isConfidentialToHr = false")
    List<FeedbackComment> findVisibleCommentsForAssignment(@Param("assignmentId") Long assignmentId);

    @Query("SELECT c FROM FeedbackComment c WHERE c.assessment.assignment.id = :assignmentId")
    List<FeedbackComment> findAllCommentsForAssignmentIncludingConfidential(@Param("assignmentId") Long assignmentId);
}
