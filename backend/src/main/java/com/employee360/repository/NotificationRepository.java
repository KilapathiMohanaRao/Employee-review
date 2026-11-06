package com.employee360.repository;

import com.employee360.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientUserId);
    List<Notification> findByRecipientUserIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientUserId);
    long countByRecipientUserIdAndIsReadFalse(Long recipientUserId);
}
