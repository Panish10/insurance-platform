package com.insurance.claims.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClaimRequest {

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotNull(message = "Claim amount is required")
    @DecimalMin(value = "1.00", message = "Claim amount must be at least 1")
    private BigDecimal claimAmount;
}