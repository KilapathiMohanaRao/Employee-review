package com.employee360.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback_questions")
public class FeedbackQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private FeedbackCampaign campaign;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false)
    private String categoryName;

    @Column(nullable = false)
    private String questionType = "RATING"; // "RATING" or "TEXT"

    private int minRating = 1;

    private int maxRating = 5;

    private int sortOrder = 0;

    private boolean required = true;

    private boolean active = true;

    public FeedbackQuestion() {}

    public FeedbackQuestion(FeedbackCampaign campaign, String categoryName, String questionText, int sortOrder) {
        this.campaign = campaign;
        this.categoryName = categoryName;
        this.questionText = questionText;
        this.sortOrder = sortOrder;
        this.questionType = "RATING";
        this.minRating = 1;
        this.maxRating = 5;
        this.required = true;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FeedbackCampaign getCampaign() { return campaign; }
    public void setCampaign(FeedbackCampaign campaign) { this.campaign = campaign; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public int getMinRating() { return minRating; }
    public void setMinRating(int minRating) { this.minRating = minRating; }

    public int getMaxRating() { return maxRating; }
    public void setMaxRating(int maxRating) { this.maxRating = maxRating; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
