package com.employee360.repository;

import com.employee360.entity.FeedbackSubmissionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackSubmissionItemRepository extends JpaRepository<FeedbackSubmissionItem, Long> {

    List<FeedbackSubmissionItem> findBySubmissionId(Long submissionId);

    @Query("SELECT item.question.id, item.question.categoryName, item.question.questionText, AVG(item.ratingScore), COUNT(item) " +
           "FROM FeedbackSubmissionItem item WHERE item.ratingScore IS NOT NULL " +
           "GROUP BY item.question.id, item.question.categoryName, item.question.questionText " +
           "ORDER BY item.question.id ASC")
    List<Object[]> findQuestionWiseRatingAnalysis();

    @Query("SELECT item.ratingScore, COUNT(item) FROM FeedbackSubmissionItem item " +
           "WHERE item.ratingScore IS NOT NULL GROUP BY item.ratingScore ORDER BY item.ratingScore ASC")
    List<Object[]> findRatingScoreDistribution();
}
