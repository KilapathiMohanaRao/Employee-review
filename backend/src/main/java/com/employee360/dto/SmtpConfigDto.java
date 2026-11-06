package com.employee360.dto;

public class SmtpConfigDto {
    private String host;
    private int port;
    private String username;
    private String password;
    private String fromEmail;
    private String fromName;
    private boolean authEnabled;
    private boolean startTlsEnabled;
    private boolean active;

    public SmtpConfigDto() {}

    public SmtpConfigDto(String host, int port, String username, String password, String fromEmail,
                         String fromName, boolean authEnabled, boolean startTlsEnabled, boolean active) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.fromEmail = fromEmail;
        this.fromName = fromName;
        this.authEnabled = authEnabled;
        this.startTlsEnabled = startTlsEnabled;
        this.active = active;
    }

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
}
