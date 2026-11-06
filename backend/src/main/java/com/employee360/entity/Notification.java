package com.employee360.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipientUser;

    @Column(nullable = false, length = 50)
    private String type; // ASSESSMENT_ASSIGNED, DEADLINE_APPROACHING, ASSESSMENT_SUBMITTED, MANAGER_REVIEW_REQUIRED, IDP_CHECKIN_DUE, CYCLE_PUBLISHED

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 255)
    private String linkUrl;

    private boolean isRead = false;
    private LocalDateTime readAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(User recipientUser, String type, String title, String message, String linkUrl) {
        this.recipientUser = recipientUser;
        this.type = type;
        this.title = title;
        this.message = message;
        this.linkUrl = linkUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRecipientUser() { return recipientUser; }
    public void setRecipientUser(User recipientUser) { this.recipientUser = recipientUser; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLinkUrl() { return linkUrl; }
    public void setLinkUrl(String linkUrl) { this.linkUrl = linkUrl; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
