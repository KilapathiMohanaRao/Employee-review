package com.employee360.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class BulkInvitationRequest {

    @NotEmpty(message = "At least one reviewer invitation is required")
    @Valid
    private List<FeedbackInvitationRequest> invitations;

    public BulkInvitationRequest() {}

    public BulkInvitationRequest(List<FeedbackInvitationRequest> invitations) {
        this.invitations = invitations;
    }

    public List<FeedbackInvitationRequest> getInvitations() { return invitations; }
    public void setInvitations(List<FeedbackInvitationRequest> invitations) { this.invitations = invitations; }
}
