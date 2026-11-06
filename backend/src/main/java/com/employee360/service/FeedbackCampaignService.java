package com.employee360.service;

import com.employee360.entity.FeedbackCampaign;
import com.employee360.repository.FeedbackCampaignRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedbackCampaignService {

    private final FeedbackCampaignRepository campaignRepository;

    public FeedbackCampaignService(FeedbackCampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    @Transactional(readOnly = true)
    public FeedbackCampaign getActiveCampaign() {
        return campaignRepository.findFirstByActiveTrueOrderByCreatedAtDesc()
                .orElseGet(() -> {
                    FeedbackCampaign fallback = new FeedbackCampaign(
                            "2026 Admin 360° Comprehensive Leadership Review",
                            "Arthur Pendelton",
                            "VP of Engineering & Lead Administrator",
                            "superadmin@enterprise.com",
                            "Comprehensive 360-degree feedback collection evaluating leadership, technical direction, problem solving, and collaboration."
                    );
                    return campaignRepository.save(fallback);
                });
    }

    @Transactional
    public FeedbackCampaign updateCampaign(FeedbackCampaign updated) {
        FeedbackCampaign current = getActiveCampaign();
        current.setTitle(updated.getTitle());
        current.setAdminName(updated.getAdminName());
        current.setAdminTitle(updated.getAdminTitle());
        current.setAdminEmail(updated.getAdminEmail());
        current.setDescription(updated.getDescription());
        current.setActive(updated.isActive());
        if (updated.getPublicBaseUrl() != null) {
            String clean = updated.getPublicBaseUrl().trim();
            while (clean.endsWith("/")) {
                clean = clean.substring(0, clean.length() - 1);
            }
            current.setPublicBaseUrl(clean);
            if (!clean.isBlank()) {
                System.setProperty("APP_BASE_URL", clean);
            }
        }
        return campaignRepository.save(current);
    }
}
