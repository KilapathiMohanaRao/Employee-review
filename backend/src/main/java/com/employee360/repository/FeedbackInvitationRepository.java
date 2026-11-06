package com.employee360.repository;

import com.employee360.entity.FeedbackInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackInvitationRepository extends JpaRepository<FeedbackInvitation, Long> {

    Optional<FeedbackInvitation> findByToken(String token);

    Optional<FeedbackInvitation> findByTokenHash(String tokenHash);

    Optional<FeedbackInvitation> findFirstByReviewerEmailIgnoreCaseOrderBySentAtDesc(String reviewerEmail);

    List<FeedbackInvitation> findAllByOrderBySentAtDesc();

    List<FeedbackInvitation> findByCampaignIdOrderBySentAtDesc(Long campaignId);

    long countByStatus(String status);

    long countByCampaignId(Long campaignId);

    long countByCampaignIdAndStatus(Long campaignId, String status);

    @Query("SELECT i FROM FeedbackInvitation i WHERE " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:category IS NULL OR i.reviewCategory = :category) AND " +
           "(:query IS NULL OR LOWER(i.reviewerName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.reviewerEmail) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY i.sentAt DESC")
    List<FeedbackInvitation> searchInvitations(
            @Param("status") String status,
            @Param("category") String category,
            @Param("query") String query
    );
}
