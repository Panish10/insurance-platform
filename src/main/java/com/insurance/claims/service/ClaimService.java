package com.insurance.claims.service;

import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.claims.client.PolicyServiceClient;
import com.insurance.claims.dto.request.CreateClaimRequest;
import com.insurance.claims.dto.response.ClaimResponse;
import com.insurance.claims.entity.Claim;
import com.insurance.claims.enums.ClaimStatus;
import com.insurance.claims.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyServiceClient policyServiceClient;

    // ----------------------------------------------------------------
    // SUBMIT CLAIM
    // ----------------------------------------------------------------
    @Transactional
    public ClaimResponse submitClaim(CreateClaimRequest request, Long userId) {
        log.info("User {} submitting claim for policy {}",
                userId, request.getPolicyId());

        // verify policy exists by calling policy-service via Feign
        try {
            policyServiceClient.getPolicyById(request.getPolicyId());
        } catch (Exception e) {
            throw new BusinessException(
                    "Policy not found with id: " + request.getPolicyId(),
                    "POLICY_NOT_FOUND",
                    HttpStatus.NOT_FOUND
            );
        }

        // check if user already has a pending claim for this policy
        if (claimRepository.existsByUserIdAndPolicyIdAndStatus(
                userId, request.getPolicyId(), ClaimStatus.PENDING)) {
            throw new BusinessException(
                    "You already have a pending claim for this policy",
                    "CLAIM_ALREADY_EXISTS",
                    HttpStatus.CONFLICT
            );
        }

        Claim claim = Claim.builder()
                .userId(userId)
                .policyId(request.getPolicyId())
                .title(request.getTitle())
                .description(request.getDescription())
                .claimAmount(request.getClaimAmount())
                .status(ClaimStatus.PENDING)
                .build();

        Claim saved = claimRepository.save(claim);
        log.info("Claim submitted with id: {}", saved.getId());
        return mapToClaimResponse(saved);
    }

    // ----------------------------------------------------------------
    // GET MY CLAIMS
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(Long userId) {
        return claimRepository.findByUserId(userId)
                .stream()
                .map(this::mapToClaimResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // GET CLAIM BY ID
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public ClaimResponse getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Claim", "id", id));
        return mapToClaimResponse(claim);
    }

    // ----------------------------------------------------------------
    // GET ALL CLAIMS (admin)
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(this::mapToClaimResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // UPDATE CLAIM STATUS (admin)
    // ----------------------------------------------------------------
    @Transactional
    public ClaimResponse updateClaimStatus(Long claimId,
                                           ClaimStatus newStatus,
                                           String notes) {
        log.info("Updating claim {} status to {}", claimId, newStatus);

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Claim", "id", claimId));

        claim.setStatus(newStatus);

        if (newStatus == ClaimStatus.REJECTED) {
            claim.setRejectionReason(notes);
        } else {
            claim.setReviewNotes(notes);
        }

        Claim saved = claimRepository.save(claim);
        return mapToClaimResponse(saved);
    }

    // ----------------------------------------------------------------
    // PRIVATE MAPPER
    // ----------------------------------------------------------------
    private ClaimResponse mapToClaimResponse(Claim claim) {
        return ClaimResponse.builder()
                .id(claim.getId())
                .userId(claim.getUserId())
                .policyId(claim.getPolicyId())
                .title(claim.getTitle())
                .description(claim.getDescription())
                .claimAmount(claim.getClaimAmount())
                .status(claim.getStatus())
                .rejectionReason(claim.getRejectionReason())
                .reviewNotes(claim.getReviewNotes())
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt())
                .build();
    }
}