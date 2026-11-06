package com.employee360.repository;

import com.employee360.entity.FeedbackQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackQuestionRepository extends JpaRepository<FeedbackQuestion, Long> {
    List<FeedbackQuestion> findByCampaignIdAndActiveTrueOrderBySortOrderAsc(Long campaignId);
    List<FeedbackQuestion> findByActiveTrueOrderBySortOrderAsc();
}
