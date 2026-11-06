package com.employee360.dto;

public class FeedbackQuestionDto {
    private Long id;
    private String categoryName;
    private String questionText;
    private String questionType;
    private int minRating;
    private int maxRating;
    private int sortOrder;
    private boolean required;

    public FeedbackQuestionDto() {}

    public FeedbackQuestionDto(Long id, String categoryName, String questionText, String questionType,
                               int minRating, int maxRating, int sortOrder, boolean required) {
        this.id = id;
        this.categoryName = categoryName;
        this.questionText = questionText;
        this.questionType = questionType;
        this.minRating = minRating;
        this.maxRating = maxRating;
        this.sortOrder = sortOrder;
        this.required = required;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

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
}
