package com.employee360.service;

import com.employee360.dto.FeedbackQuestionDto;
import com.employee360.entity.FeedbackCampaign;
import com.employee360.entity.FeedbackQuestion;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.FeedbackQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackQuestionService {

    private final FeedbackQuestionRepository questionRepository;
    private final FeedbackCampaignService campaignService;

    public FeedbackQuestionService(FeedbackQuestionRepository questionRepository,
                                   FeedbackCampaignService campaignService) {
        this.questionRepository = questionRepository;
        this.campaignService = campaignService;
    }

    @Transactional(readOnly = true)
    public List<FeedbackQuestionDto> getQuestionsForActiveCampaign() {
        FeedbackCampaign campaign = campaignService.getActiveCampaign();
        List<FeedbackQuestion> list = questionRepository.findByCampaignIdAndActiveTrueOrderBySortOrderAsc(campaign.getId());
        if (list.isEmpty()) {
            list = questionRepository.findByActiveTrueOrderBySortOrderAsc();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public FeedbackQuestionDto createQuestion(FeedbackQuestionDto dto) {
        FeedbackCampaign campaign = campaignService.getActiveCampaign();
        FeedbackQuestion q = new FeedbackQuestion();
        q.setCampaign(campaign);
        q.setCategoryName(dto.getCategoryName());
        q.setQuestionText(dto.getQuestionText());
        q.setQuestionType(dto.getQuestionType() != null ? dto.getQuestionType() : "RATING");
        q.setMinRating(dto.getMinRating() > 0 ? dto.getMinRating() : 1);
        q.setMaxRating(dto.getMaxRating() > 0 ? dto.getMaxRating() : 5);
        q.setSortOrder(dto.getSortOrder());
        q.setRequired(dto.isRequired());
        q.setActive(true);
        FeedbackQuestion saved = questionRepository.save(q);
        return toDto(saved);
    }

    @Transactional
    public FeedbackQuestionDto updateQuestion(Long id, FeedbackQuestionDto dto) {
        FeedbackQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + id));
        q.setCategoryName(dto.getCategoryName());
        q.setQuestionText(dto.getQuestionText());
        if (dto.getQuestionType() != null) q.setQuestionType(dto.getQuestionType());
        if (dto.getMinRating() > 0) q.setMinRating(dto.getMinRating());
        if (dto.getMaxRating() > 0) q.setMaxRating(dto.getMaxRating());
        q.setSortOrder(dto.getSortOrder());
        q.setRequired(dto.isRequired());
        FeedbackQuestion saved = questionRepository.save(q);
        return toDto(saved);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        FeedbackQuestion q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + id));
        q.setActive(false);
        questionRepository.save(q);
    }

    @Transactional
    public void seedDefaultQuestionsIfEmpty(FeedbackCampaign campaign) {
        if (questionRepository.count() > 0) return;

        List<FeedbackQuestion> defaults = new ArrayList<>();
        defaults.add(new FeedbackQuestion(campaign, "Communication Skills", "Communicates vision, priorities, and technical decisions with clarity and transparency across all levels.", 1));
        defaults.add(new FeedbackQuestion(campaign, "Leadership Skills", "Provides clear strategic direction, empowers colleagues, and inspires high accountability.", 2));
        defaults.add(new FeedbackQuestion(campaign, "Technical Knowledge", "Demonstrates deep architectural expertise, engineering foresight, and technical judgment.", 3));
        defaults.add(new FeedbackQuestion(campaign, "Problem-Solving Skills", "Navigates complex challenges methodically and drives pragmatic, scalable solutions.", 4));
        defaults.add(new FeedbackQuestion(campaign, "Team Collaboration", "Cultivates an inclusive, collaborative environment and breaks down organizational silos.", 5));
        defaults.add(new FeedbackQuestion(campaign, "Decision-Making Skills", "Makes sound, timely, and data-informed decisions even under ambiguity or pressure.", 6));
        defaults.add(new FeedbackQuestion(campaign, "Professional Behaviour", "Exemplifies integrity, mutual respect, constructive feedback, and ethical conduct.", 7));
        defaults.add(new FeedbackQuestion(campaign, "Overall Performance", "Overall leadership effectiveness, impact, and value delivered to the organization.", 8));

        questionRepository.saveAll(defaults);
    }

    public FeedbackQuestionDto toDto(FeedbackQuestion q) {
        return new FeedbackQuestionDto(
                q.getId(),
                q.getCategoryName(),
                q.getQuestionText(),
                q.getQuestionType(),
                q.getMinRating(),
                q.getMaxRating(),
                q.getSortOrder(),
                q.isRequired()
        );
    }
}
