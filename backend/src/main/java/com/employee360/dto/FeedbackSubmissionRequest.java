package com.employee360.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class FeedbackSubmissionRequest {

    @NotBlank(message = "Invitation token is required")
    private String token;

    @NotEmpty(message = "At least one rating response is required")
    private List<QuestionResponseItem> items;

    private String summaryFeedback;

    private String strengthsComment;

    private String improvementsComment;

    public FeedbackSubmissionRequest() {}

    public FeedbackSubmissionRequest(String token, List<QuestionResponseItem> items,
                                     String summaryFeedback, String strengthsComment, String improvementsComment) {
        this.token = token;
        this.items = items;
        this.summaryFeedback = summaryFeedback;
        this.strengthsComment = strengthsComment;
        this.improvementsComment = improvementsComment;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public List<QuestionResponseItem> getItems() { return items; }
    public void setItems(List<QuestionResponseItem> items) { this.items = items; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getStrengthsComment() { return strengthsComment; }
    public void setStrengthsComment(String strengthsComment) { this.strengthsComment = strengthsComment; }

    public String getImprovementsComment() { return improvementsComment; }
    public void setImprovementsComment(String improvementsComment) { this.improvementsComment = improvementsComment; }

    public static class QuestionResponseItem {
        private Long questionId;
        private Integer ratingScore; // 1 to 5
        private String comment;

        public QuestionResponseItem() {}

        public QuestionResponseItem(Long questionId, Integer ratingScore, String comment) {
            this.questionId = questionId;
            this.ratingScore = ratingScore;
            this.comment = comment;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public Integer getRatingScore() { return ratingScore; }
        public void setRatingScore(Integer ratingScore) { this.ratingScore = ratingScore; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
