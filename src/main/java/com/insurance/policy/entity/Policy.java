package com.insurance.policy.entity;

import com.insurance.policy.enums.PolicyStatus;
import com.insurance.policy.enums.PolicyType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PolicyType policyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PolicyStatus status;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal premium;        // monthly premium amount

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal coverageAmount; // total coverage amount

    @Column(nullable = false)
    private Integer durationMonths;    // policy duration in months

    @Column(nullable = false)
    private Long createdByUserId;      // admin who created this policy

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}