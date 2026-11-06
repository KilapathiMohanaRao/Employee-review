package com.employee360.dto;

public class ResponseItemDto {
    private Long behaviourId;
    private Integer score; // 1 to 5, or null
    private boolean notObserved;
    private String comments;

    public ResponseItemDto() {}

    public ResponseItemDto(Long behaviourId, Integer score, boolean notObserved, String comments) {
        this.behaviourId = behaviourId;
        this.score = score;
        this.notObserved = notObserved;
        this.comments = comments;
    }

    public Long getBehaviourId() { return behaviourId; }
    public void setBehaviourId(Long behaviourId) { this.behaviourId = behaviourId; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public boolean isNotObserved() { return notObserved; }
    public void setNotObserved(boolean notObserved) { this.notObserved = notObserved; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
