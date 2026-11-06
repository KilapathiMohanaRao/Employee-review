package com.employee360.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_invitations", indexes = {
    @Index(name = "idx_invitation_token", columnList = "token"),
    @Index(name = "idx_invitation_status", columnList = "status"),
    @Index(name = "idx_invitation_email", columnList = "reviewerEmail")
})
public class FeedbackInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private FeedbackCampaign campaign;

    @Column(nullable = false)
    private String reviewerName;

    @Column(nullable = false)
    private String reviewerEmail;

    @Column(nullable = false)
    private String reviewCategory; // SELF, MANAGER, PEER_1, PEER_2, PEER_3, TEAM_LEAD, HR, GENERAL

    @Column(nullable = false, unique = true, length = 128)
    private String token;

    @Column(length = 128)
    private String tokenHash;

    @Column(nullable = false, length = 32)
    private String status = "PENDING"; // PENDING, SUBMITTED, EXPIRED, CANCELLED

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    private LocalDateTime submittedAt;

    private LocalDateTime expiresAt;

    @Column(length = 32)
    private String emailDeliveryStatus = "PENDING"; // PENDING, SENT, DELIVERED, BOUNCED, FAILED, OPENED, SUBMITTED

    @Column(columnDefinition = "TEXT")
    private String emailDeliveryError;

    private int retryCount = 0;

    private LocalDateTime deliveredAt;

    private LocalDateTime openedAt;

    @Column(length = 500)
    private String publicFeedbackUrl;

    public FeedbackInvitation() {}

    public FeedbackInvitation(FeedbackCampaign campaign, String reviewerName, String reviewerEmail,
                              String reviewCategory, String token, String tokenHash, LocalDateTime expiresAt) {
        this.campaign = campaign;
        this.reviewerName = reviewerName;
        this.reviewerEmail = reviewerEmail;
        this.reviewCategory = reviewCategory;
        this.token = token;
        this.tokenHash = tokenHash;
        this.status = "PENDING";
        this.sentAt = LocalDateTime.now();
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FeedbackCampaign getCampaign() { return campaign; }
    public void setCampaign(FeedbackCampaign campaign) { this.campaign = campaign; }

    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

    public String getReviewerEmail() { return reviewerEmail; }
    public void setReviewerEmail(String reviewerEmail) { this.reviewerEmail = reviewerEmail; }

    public String getReviewCategory() { return reviewCategory; }
    public void setReviewCategory(String reviewCategory) { this.reviewCategory = reviewCategory; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenHash() { return tokenHash; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public String getEmailDeliveryStatus() { return emailDeliveryStatus; }
    public void setEmailDeliveryStatus(String emailDeliveryStatus) { this.emailDeliveryStatus = emailDeliveryStatus; }

    public String getEmailDeliveryError() { return emailDeliveryError; }
    public void setEmailDeliveryError(String emailDeliveryError) { this.emailDeliveryError = emailDeliveryError; }

    public int getRetryCount() { return retryCount; }
    public void setRetryCount(int retryCount) { this.retryCount = retryCount; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getOpenedAt() { return openedAt; }
    public void setOpenedAt(LocalDateTime openedAt) { this.openedAt = openedAt; }

    public String getPublicFeedbackUrl() { return publicFeedbackUrl; }
    public void setPublicFeedbackUrl(String publicFeedbackUrl) { this.publicFeedbackUrl = publicFeedbackUrl; }
}
