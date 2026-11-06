package com.employee360.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "smtp_configs")
public class SmtpConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String host = "smtp.gmail.com";

    private int port = 587;

    private String username = "";

    private String password = "";

    private String fromEmail = "admin.reviews@enterprise.com";

    private String fromName = "Admin 360 Review System";

    private boolean authEnabled = true;

    private boolean startTlsEnabled = true;

    private boolean active = false;

    private String providerType = "SMTP"; // SMTP, RESEND, SENDGRID

    @Column(length = 500)
    private String apiKey = "";

    private LocalDateTime updatedAt = LocalDateTime.now();

    public SmtpConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }

    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }

    public boolean isAuthEnabled() { return authEnabled; }
    public void setAuthEnabled(boolean authEnabled) { this.authEnabled = authEnabled; }

    public boolean isStartTlsEnabled() { return startTlsEnabled; }
    public void setStartTlsEnabled(boolean startTlsEnabled) { this.startTlsEnabled = startTlsEnabled; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getProviderType() { return providerType; }
    public void setProviderType(String providerType) { this.providerType = providerType; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
