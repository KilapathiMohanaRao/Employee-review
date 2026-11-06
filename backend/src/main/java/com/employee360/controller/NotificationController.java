package com.employee360.controller;

import com.employee360.dto.ApiResponse;
import com.employee360.dto.NotificationDto;
import com.employee360.security.CustomUserDetails;
import com.employee360.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long userId) {

        Long targetUserId = userId;
        if (targetUserId == null && userDetails != null) {
            targetUserId = userDetails.getId();
        }

        if (targetUserId == null) {
            targetUserId = 4L; // Default Alex Employee user
        }

        List<NotificationDto> notifications = notificationService.getUserNotifications(targetUserId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long userId) {

        Long targetUserId = userId;
        if (targetUserId == null && userDetails != null) {
            targetUserId = userDetails.getId();
        }

        if (targetUserId == null) {
            targetUserId = 4L;
        }

        long count = notificationService.getUnreadCount(targetUserId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) Long userId) {

        Long targetUserId = userId;
        if (targetUserId == null && userDetails != null) {
            targetUserId = userDetails.getId();
        }

        if (targetUserId == null) {
            targetUserId = 4L;
        }

        notificationService.markAllAsRead(targetUserId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
