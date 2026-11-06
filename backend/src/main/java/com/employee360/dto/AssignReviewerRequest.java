package com.employee360.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class AssignReviewerRequest {
    @NotNull(message = "Reviewer ID is required")
    private Long reviewerId;

    @NotBlank(message = "Review type is required")
    private String reviewType; // SELF, MANAGER, PEER, DIRECT_REPORT, CROSS_FUNCTIONAL, OTHER_STAKEHOLDER

    private Boolean isAnonymous;
    private BigDecimal weight;

    public AssignReviewerRequest() {}

    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }
}
