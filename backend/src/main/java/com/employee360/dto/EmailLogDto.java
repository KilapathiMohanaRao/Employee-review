package com.employee360.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailLogDto {
    private Long id;
    private String recipientEmail;
    private String recipientName;
    private String subject;
    private String status;
    private String errorMessage;
    private LocalDateTime sentAt;
}
