package com.insurance.claims.dto.response;

import com.insurance.claims.enums.ClaimStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {

    private Long id;
    private Long userId;
    private Long policyId;
    private String title;
    private String description;
    private BigDecimal claimAmount;
    private ClaimStatus status;
    private String rejectionReason;
    private String reviewNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}