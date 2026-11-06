package com.employee360.repository;

import com.employee360.entity.FeedbackSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackSubmissionRepository extends JpaRepository<FeedbackSubmission, Long> {

    List<FeedbackSubmission> findAllByOrderBySubmittedAtDesc();

    List<FeedbackSubmission> findByCampaignIdOrderBySubmittedAtDesc(Long campaignId);

    Optional<FeedbackSubmission> findByInvitationId(Long invitationId);

    @Query("SELECT AVG(s.overallRating) FROM FeedbackSubmission s")
    BigDecimal findOverallAverageRating();

    @Query("SELECT AVG(s.overallRating) FROM FeedbackSubmission s WHERE s.campaign.id = :campaignId")
    BigDecimal findOverallAverageRatingByCampaign(@Param("campaignId") Long campaignId);

    @Query("SELECT s.invitation.reviewCategory, AVG(s.overallRating), COUNT(s) " +
           "FROM FeedbackSubmission s GROUP BY s.invitation.reviewCategory")
    List<Object[]> findAverageRatingByCategory();

    @Query("SELECT s FROM FeedbackSubmission s WHERE " +
           "(:category IS NULL OR s.invitation.reviewCategory = :category) AND " +
           "(:query IS NULL OR LOWER(s.invitation.reviewerName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.invitation.reviewerEmail) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY s.submittedAt DESC")
    List<FeedbackSubmission> searchSubmissions(@Param("category") String category, @Param("query") String query);
}
