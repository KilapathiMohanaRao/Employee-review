package com.employee360.repository;

import com.employee360.entity.ReviewerRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewerRelationshipRepository extends JpaRepository<ReviewerRelationship, Long> {
    List<ReviewerRelationship> findByAssignmentId(Long assignmentId);
    List<ReviewerRelationship> findByReviewerId(Long reviewerId);
    List<ReviewerRelationship> findByReviewerIdAndStatus(Long reviewerId, String status);
    Optional<ReviewerRelationship> findByAssignmentIdAndReviewerIdAndReviewType(Long assignmentId, Long reviewerId, String reviewType);

    @Query("SELECT r FROM ReviewerRelationship r WHERE r.reviewer.id = :reviewerId ORDER BY r.createdAt DESC")
    List<ReviewerRelationship> findAllMyReviews(@Param("reviewerId") Long reviewerId);
}
