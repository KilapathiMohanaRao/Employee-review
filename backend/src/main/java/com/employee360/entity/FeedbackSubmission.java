package com.employee360.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "feedback_submissions")
public class FeedbackSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private FeedbackCampaign campaign;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false, unique = true)
    private FeedbackInvitation invitation;

    @Column(precision = 4, scale = 2)
    private BigDecimal overallRating;

    @Column(columnDefinition = "TEXT")
    private String summaryFeedback;

    @Column(columnDefinition = "TEXT")
    private String strengthsComment;

    @Column(columnDefinition = "TEXT")
    private String improvementsComment;

    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    private String clientIp;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FeedbackSubmissionItem> items = new ArrayList<>();

    public FeedbackSubmission() {}

    public FeedbackSubmission(FeedbackCampaign campaign, FeedbackInvitation invitation,
                              BigDecimal overallRating, String summaryFeedback,
                              String strengthsComment, String improvementsComment) {
        this.campaign = campaign;
        this.invitation = invitation;
        this.overallRating = overallRating;
        this.summaryFeedback = summaryFeedback;
        this.strengthsComment = strengthsComment;
        this.improvementsComment = improvementsComment;
        this.submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FeedbackCampaign getCampaign() { return campaign; }
    public void setCampaign(FeedbackCampaign campaign) { this.campaign = campaign; }

    public FeedbackInvitation getInvitation() { return invitation; }
    public void setInvitation(FeedbackInvitation invitation) { this.invitation = invitation; }

    public BigDecimal getOverallRating() { return overallRating; }
    public void setOverallRating(BigDecimal overallRating) { this.overallRating = overallRating; }

    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }

    public String getStrengthsComment() { return strengthsComment; }
    public void setStrengthsComment(String strengthsComment) { this.strengthsComment = strengthsComment; }

    public String getImprovementsComment() { return improvementsComment; }
    public void setImprovementsComment(String improvementsComment) { this.improvementsComment = improvementsComment; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public String getClientIp() { return clientIp; }
    public void setClientIp(String clientIp) { this.clientIp = clientIp; }

    public List<FeedbackSubmissionItem> getItems() { return items; }
    public void setItems(List<FeedbackSubmissionItem> items) { this.items = items; }
}
