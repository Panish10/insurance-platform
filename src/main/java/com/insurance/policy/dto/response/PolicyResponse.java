package com.insurance.policy.dto.response;

import com.insurance.policy.enums.PolicyStatus;
import com.insurance.policy.enums.PolicyType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {

    private Long id;
    private String name;
    private String description;
    private PolicyType policyType;
    private PolicyStatus status;
    private BigDecimal premium;
    private BigDecimal coverageAmount;
    private Integer durationMonths;
    private Long createdByUserId;
    private LocalDateTime createdAt;
}