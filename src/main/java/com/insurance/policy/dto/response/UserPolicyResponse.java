package com.insurance.policy.dto.response;

import com.insurance.policy.enums.PolicyStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPolicyResponse {

    private Long id;
    private Long userId;
    private PolicyResponse policy;
    private PolicyStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime subscribedAt;
}