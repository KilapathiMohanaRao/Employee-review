package com.employee360.service;

import com.employee360.entity.EmailLog;
import com.employee360.entity.SmtpConfig;
import com.employee360.repository.EmailLogRepository;
import com.employee360.repository.SmtpConfigRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Properties;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final EmailLogRepository emailLogRepository;
    private final SmtpConfigRepository smtpConfigRepository;
    private final JavaMailSender defaultMailSender;

    @Value("${app.frontend.url:${app.base-url:http://localhost:5173}}")
    private String defaultFrontendUrl;

    public EmailService(EmailLogRepository emailLogRepository,
                        SmtpConfigRepository smtpConfigRepository,
                        Optional<JavaMailSender> defaultMailSender) {
        this.emailLogRepository = emailLogRepository;
        this.smtpConfigRepository = smtpConfigRepository;
        this.defaultMailSender = defaultMailSender.orElse(null);
    }

    public static class EmailDispatchResult {
        private final boolean success;
        private final String status; // SENT, FAILED, SIMULATED, DELIVERED
        private final String errorMessage;

        public EmailDispatchResult(boolean success, String status, String errorMessage) {
            this.success = success;
            this.status = status;
            this.errorMessage = errorMessage;
        }

        public boolean isSuccess() { return success; }
        public String getStatus() { return status; }
        public String getErrorMessage() { return errorMessage; }
    }

    public EmailDispatchResult sendFeedbackInvitation(String reviewerName, String reviewerEmail, String adminName,
                                                      String reviewCategory, String token, String customInstructions,
                                                      String feedbackUrl) {
        String effectiveUrl = (feedbackUrl != null && !feedbackUrl.isBlank())
                ? feedbackUrl
                : defaultFrontendUrl + "/feedback/" + token;

        String subject = "Request for Feedback and Review - " + adminName;

        String plainTextBody = "Hello " + reviewerName + ",\n\n" +
                "You are invited to provide your feedback and review about " + adminName + " (" + reviewCategory + ").\n\n" +
                (customInstructions != null && !customInstructions.isBlank() ? "Note from Admin: " + customInstructions + "\n\n" : "") +
                "Please click the link below to complete the feedback form directly:\n" +
                effectiveUrl + "\n\n" +
                "Your feedback is completely confidential and securely collected for the Administrator.\n" +
                "Note: No login or account creation is required.\n\n" +
                "Thank you.\n" +
                "Admin Team\n";

        String htmlBody = buildHtmlEmail(reviewerName, adminName, reviewCategory, effectiveUrl, customInstructions);

        return dispatchEmail(reviewerEmail, reviewerName, subject, plainTextBody, htmlBody);
    }

    public EmailDispatchResult sendTestEmail(String toEmail) {
        String subject = "Verification Test - Admin 360 Review System";
        String body = "This is a real-time verification email sent from your configured email pipeline in the Admin 360 Review System.\n\n" +
                "If you are reading this in your inbox, your real email delivery system is functioning correctly!";
        return dispatchEmail(toEmail, "Admin Tester", subject, body, "<div style='font-family:sans-serif;padding:20px;background:#f8fafc;border-radius:10px;'><h3>Admin 360 Email Verification</h3><p>" + body.replace("\n\n", "</p><p>") + "</p></div>");
    }

    private EmailDispatchResult dispatchEmail(String recipientEmail, String recipientName, String subject, String plainTextBody, String htmlBody) {
        SmtpConfig config = smtpConfigRepository.findFirstByOrderByIdAsc().orElse(null);
        String from = (config != null && config.getFromEmail() != null && !config.getFromEmail().isBlank())
                ? config.getFromEmail() : "admin.reviews@enterprise.com";
        String fromName = (config != null && config.getFromName() != null && !config.getFromName().isBlank())
                ? config.getFromName() : "Mohan Kilaparthi";

        // 1. Transactional REST API: Resend
        if (config != null && "RESEND".equalsIgnoreCase(config.getProviderType()) && config.getApiKey() != null && !config.getApiKey().isBlank()) {
            return dispatchViaResendApi(config.getApiKey().trim(), from, fromName, recipientEmail, recipientName, subject, htmlBody, plainTextBody);
        }

        // 2. Real SMTP Dispatch
        JavaMailSender sender = getActiveMailSender();
        if (sender != null && config != null && config.isActive() && config.getUsername() != null && !config.getUsername().isBlank()) {
            // Verify password is not blank
            if (config.getPassword() == null || config.getPassword().isBlank()) {
                String errMsg = "SMTP Password is not configured. Please enter your SMTP password (or Google App Password for Gmail) in Email Management or .env file.";
                log.warn("Cannot dispatch email: {}", errMsg);
                emailLogRepository.save(new EmailLog(recipientEmail, recipientName, subject, plainTextBody, "FAILED", errMsg));
                return new EmailDispatchResult(false, "FAILED", errMsg);
            }

            try {
                MimeMessage message = sender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(from, fromName);
                helper.setTo(recipientEmail);
                helper.setSubject(subject);
                helper.setText(plainTextBody, htmlBody);

                sender.send(message);
                log.info("Email successfully accepted and sent to {} via SMTP server ({}:{})", recipientEmail, config.getHost(), config.getPort());

                emailLogRepository.save(new EmailLog(recipientEmail, recipientName, subject, plainTextBody, "SENT", null));
                return new EmailDispatchResult(true, "SENT", null);
            } catch (Exception e) {
                String rawMsg = e.getMessage() != null ? e.getMessage() : "";
                String errMsg;

                if (rawMsg.contains("535") || rawMsg.contains("Authentication failed") || rawMsg.contains("BadCredentials") || rawMsg.contains("Username and Password not accepted")) {
                    errMsg = "Gmail SMTP Authentication Failed (535): Google requires a 16-character Google App Password (not your normal account password). Generate one in Google Account > Security > 2-Step Verification > App Passwords.";
                } else if (rawMsg.contains("ConnectException") || rawMsg.contains("timed out") || rawMsg.contains("Timeout")) {
                    errMsg = "SMTP Connection Timeout: Unable to connect to " + config.getHost() + ":" + config.getPort() + ". Check network or try Port 465 (SSL) / 587 (TLS).";
                } else if (rawMsg.contains("UnknownHostException")) {
                    errMsg = "Unknown SMTP Host: Could not resolve " + config.getHost() + ". Please check hostname.";
                } else {
                    errMsg = "SMTP Error: " + rawMsg;
                }

                log.warn("SMTP transmission failed to {}: {}. Logged in database.", recipientEmail, errMsg);
                emailLogRepository.save(new EmailLog(recipientEmail, recipientName, subject, plainTextBody, "FAILED", errMsg));
                return new EmailDispatchResult(false, "FAILED", errMsg);
            }
        } else {
            String warning = "SMTP configuration is inactive or username is missing. Please configure Email Management.";
            log.info("Simulated dispatch to {}. Direct feedback URL recorded.", recipientEmail);
            emailLogRepository.save(new EmailLog(recipientEmail, recipientName, subject, plainTextBody, "SIMULATED", warning));
            return new EmailDispatchResult(true, "SIMULATED", warning);
        }
    }

    private EmailDispatchResult dispatchViaResendApi(String apiKey, String fromEmail, String fromName, String toEmail, String toName, String subject, String htmlBody, String textBody) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            String sender = fromName != null && !fromName.isBlank()
                    ? fromName + " <" + fromEmail + ">"
                    : fromEmail;

            // Simple JSON escaping
            String escapedSubject = escapeJson(subject);
            String escapedHtml = escapeJson(htmlBody);
            String escapedText = escapeJson(textBody);

            String jsonPayload = "{" +
                    "\"from\":\"" + escapeJson(sender) + "\"," +
                    "\"to\":[\"" + escapeJson(toEmail) + "\"]," +
                    "\"subject\":\"" + escapedSubject + "\"," +
                    "\"html\":\"" + escapedHtml + "\"," +
                    "\"text\":\"" + escapedText + "\"" +
                    "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email delivered via Resend API to {}: Status {}", toEmail, response.statusCode());
                emailLogRepository.save(new EmailLog(toEmail, toName, subject, textBody, "SENT", null));
                return new EmailDispatchResult(true, "SENT", null);
            } else {
                String errMsg = "Resend API error (HTTP " + response.statusCode() + "): " + response.body();
                log.warn("Resend API failed: {}", errMsg);
                emailLogRepository.save(new EmailLog(toEmail, toName, subject, textBody, "FAILED", errMsg));
                return new EmailDispatchResult(false, "FAILED", errMsg);
            }
        } catch (Exception e) {
            String errMsg = "Failed to dispatch via Resend API: " + e.getMessage();
            log.error(errMsg, e);
            emailLogRepository.save(new EmailLog(toEmail, toName, subject, textBody, "FAILED", errMsg));
            return new EmailDispatchResult(false, "FAILED", errMsg);
        }
    }

    private String escapeJson(String raw) {
        if (raw == null) return "";
        return raw.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private JavaMailSender getActiveMailSender() {
        Optional<SmtpConfig> configOpt = smtpConfigRepository.findFirstByOrderByIdAsc();
        if (configOpt.isPresent() && configOpt.get().isActive()) {
            SmtpConfig cfg = configOpt.get();
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(cfg.getHost() != null ? cfg.getHost().trim() : "smtp.gmail.com");
            mailSender.setPort(cfg.getPort() > 0 ? cfg.getPort() : 587);
            if (cfg.getUsername() != null) mailSender.setUsername(cfg.getUsername().trim());
            if (cfg.getPassword() != null) mailSender.setPassword(cfg.getPassword().trim());

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", String.valueOf(cfg.isAuthEnabled()));

            if (cfg.getPort() == 465) {
                props.put("mail.smtp.ssl.enable", "true");
                props.put("mail.smtp.socketFactory.port", "465");
                props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                props.put("mail.smtp.socketFactory.fallback", "false");
            } else {
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.starttls.required", "true");
                props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
            }

            props.put("mail.smtp.connectiontimeout", "10000");
            props.put("mail.smtp.timeout", "10000");
            props.put("mail.smtp.writetimeout", "10000");
            props.put("mail.debug", "false");

            return mailSender;
        }
        return defaultMailSender;
    }

    private String buildHtmlEmail(String reviewerName, String adminName, String category, String feedbackUrl, String customInstructions) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
                "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 24px; }" +
                ".card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }" +
                ".header { font-size: 21px; font-weight: 800; color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 14px; }" +
                ".badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }" +
                ".intro { font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 18px; }" +
                ".instructions-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 6px; margin: 18px 0; font-size: 14px; color: #475569; line-height: 1.5; }" +
                ".btn-container { text-align: center; margin: 28px 0; }" +
                ".btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; padding: 15px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }" +
                ".link-alt { font-size: 12px; color: #64748b; word-break: break-all; margin-top: 14px; text-align: center; }" +
                ".privacy-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #065f46; }" +
                ".footer { font-size: 12px; color: #94a3b8; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; }" +
                "</style></head>" +
                "<body>" +
                "<div class='card'>" +
                "<div class='badge'>" + category.replace("_", " ") + "</div>" +
                "<div class='header'>Request for Feedback &amp; Review</div>" +
                "<div class='intro'>Hello <strong>" + reviewerName + "</strong>,</div>" +
                "<div class='intro'>You have been invited to provide confidential 360-degree feedback regarding <strong>" + adminName + "</strong>.</div>" +
                (customInstructions != null && !customInstructions.isBlank() ? "<div class='instructions-box'><strong>Note from Administrator:</strong><br>" + customInstructions + "</div>" : "") +
                "<div class='privacy-box'><strong>🔒 Strictly Confidential &amp; No Login Required:</strong> You do not need to register or create an account. Simply click the link below to submit your evaluation. Your responses are collected directly in the Admin Dashboard.</div>" +
                "<div class='btn-container'><a href='" + feedbackUrl + "' class='btn' target='_blank'>Complete Feedback Form</a></div>" +
                "<div class='link-alt'>Or copy and paste this URL into your browser:<br><a href='" + feedbackUrl + "' style='color:#2563eb;'>" + feedbackUrl + "</a></div>" +
                "<div class='footer'>This review link is single-use and will automatically deactivate once submitted.<br>&copy; 2026 Admin 360 Review Management System.</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
