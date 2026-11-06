package com.employee360.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminReviewItemDetailDto {
    private Long id;
    private Long invitationId;
    private String reviewerName;
    private String reviewerEmail;
    private String reviewCategory;
    private BigDecimal overallRating;
    private String submittedAt;
    private String summaryFeedback;
    private String strengthsComment;
    private String improvementsComment;
    private List<QuestionRatingDetailDto> questionRatings;

    public AdminReviewItemDetailDto() {}

    public AdminReviewItemDetailDto(Long id, Long invitationId, String reviewerName, String reviewerEmail,
                                    String reviewCategory, BigDecimal overallRating, String submittedAt,
                                    String summaryFeedback, String strengthsComment, String improvementsComment,
                                    List<QuestionRatingDetailDto> questionRatings) {
        this.id = id;
        this.invitationId = invitationId;
        this.reviewerName = reviewerName;
        this.reviewerEmail = reviewerEmail;
        this.reviewCategory = reviewCategory;
        this.overallRating = overallRating;
        this.submittedAt = submittedAt;
        this.summaryFeedback = summaryFeedback;
        this.strengthsComment = strengthsComment;
        this.improvementsComment = improvementsComment;
        this.questionRatings = questionRatings;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInvitationId() { return invitationId; }
    public void setInvitationId(Long invitationId) { this.invitationId = invitationId; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

    public String getReviewCategory() { return reviewCategory; }
    public void setReviewCategory(String reviewCategory) { this.reviewCategory = reviewCategory; }

    public BigDecimal getOverallRating() { return overallRating; }
    public void setOverallRating(BigDecimal overallRating) { this.overallRating = overallRating; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getStrengthsComment() { return strengthsComment; }
    public void setStrengthsComment(String strengthsComment) { this.strengthsComment = strengthsComment; }

    public String getImprovementsComment() { return improvementsComment; }
    public void setImprovementsComment(String improvementsComment) { this.improvementsComment = improvementsComment; }

    public List<QuestionRatingDetailDto> getQuestionRatings() { return questionRatings; }
    public void setQuestionRatings(List<QuestionRatingDetailDto> questionRatings) { this.questionRatings = questionRatings; }

    public static class QuestionRatingDetailDto {
        private Long questionId;
        private String categoryName;
        private String questionText;
        private Integer score;
        private String comment;

        public QuestionRatingDetailDto() {}

        public QuestionRatingDetailDto(Long questionId, String categoryName, String questionText, Integer score, String comment) {
            this.questionId = questionId;
            this.categoryName = categoryName;
            this.questionText = questionText;
            this.score = score;
            this.comment = comment;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
