package com.employee360.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback_submission_items")
public class FeedbackSubmissionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private FeedbackSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private FeedbackQuestion question;

    private String categoryName;

    private Integer ratingScore; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    public FeedbackSubmissionItem() {}

    public FeedbackSubmissionItem(FeedbackSubmission submission, FeedbackQuestion question,
                                  String categoryName, Integer ratingScore, String comment) {
        this.submission = submission;
        this.question = question;
        this.categoryName = categoryName;
        this.ratingScore = ratingScore;
        this.comment = comment;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FeedbackSubmission getSubmission() { return submission; }
    public void setSubmission(FeedbackSubmission submission) { this.submission = submission; }

    public FeedbackQuestion getQuestion() { return question; }
    public void setQuestion(FeedbackQuestion question) { this.question = question; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Integer getRatingScore() { return ratingScore; }
    public void setRatingScore(Integer ratingScore) { this.ratingScore = ratingScore; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
