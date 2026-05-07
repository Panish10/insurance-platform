package com.insurance.policy.dto.request;

import com.insurance.policy.enums.PolicyType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePolicyRequest {

    @NotBlank(message = "Policy name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Policy type is required")
    private PolicyType policyType;

    @NotNull(message = "Premium amount is required")
    @DecimalMin(value = "0.01", message = "Premium must be greater than 0")
    private BigDecimal premium;

    @NotNull(message = "Coverage amount is required")
    @DecimalMin(value = "1000.00", message = "Coverage must be at least 1000")
    private BigDecimal coverageAmount;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 month")
    @Max(value = 360, message = "Duration cannot exceed 360 months")
    private Integer durationMonths;
}