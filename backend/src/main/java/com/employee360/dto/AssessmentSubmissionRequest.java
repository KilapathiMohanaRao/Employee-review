package com.employee360.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class AssessmentSubmissionRequest {
    @NotEmpty(message = "Assessment responses must not be empty")
    private List<ResponseItemDto> responses;

    private String summaryFeedback;
    private String keyStrengthsComment;
    private String developmentAreasComment;

    public AssessmentSubmissionRequest() {}

    public List<ResponseItemDto> getResponses() { return responses; }
    public void setResponses(List<ResponseItemDto> responses) { this.responses = responses; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getKeyStrengthsComment() { return keyStrengthsComment; }
    public void setKeyStrengthsComment(String keyStrengthsComment) { this.keyStrengthsComment = keyStrengthsComment; }

    public String getDevelopmentAreasComment() { return developmentAreasComment; }
    public void setDevelopmentAreasComment(String developmentAreasComment) { this.developmentAreasComment = developmentAreasComment; }
}
