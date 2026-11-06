package com.employee360.service;

import com.employee360.dto.AdminReviewItemDetailDto;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class AdminReviewExportService {

    private final FeedbackInvitationService invitationService;

    public AdminReviewExportService(FeedbackInvitationService invitationService) {
        this.invitationService = invitationService;
    }

    public ByteArrayInputStream exportReviewsToCsv() {
        List<AdminReviewItemDetailDto> reviews = invitationService.getSubmissions(null, null);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Write CSV Header
            writer.println("Submission ID,Reviewer Name,Reviewer Email,Review Category,Overall Rating,Submission Date,Key Strengths,Growth Areas,General Feedback");

            for (AdminReviewItemDetailDto r : reviews) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",%.2f,\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        r.getId(),
                        escapeCsv(r.getReviewerName()),
                        escapeCsv(r.getReviewerEmail()),
                        escapeCsv(r.getReviewCategory()),
                        r.getOverallRating() != null ? r.getOverallRating().doubleValue() : 0.0,
                        escapeCsv(r.getSubmittedAt()),
                        escapeCsv(r.getStrengthsComment()),
                        escapeCsv(r.getImprovementsComment()),
                        escapeCsv(r.getSummaryFeedback())
                );
            }
            writer.flush();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        return val.replace("\"", "\"\"").replace("\n", " ").replace("\r", " ");
    }
}
