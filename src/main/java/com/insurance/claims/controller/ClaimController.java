package com.insurance.claims.controller;

import com.insurance.common.response.ApiResponse;
import com.insurance.claims.dto.request.CreateClaimRequest;
import com.insurance.claims.dto.response.ClaimResponse;
import com.insurance.claims.enums.ClaimStatus;
import com.insurance.claims.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@RequiredArgsConstructor
@Slf4j
public class ClaimController {

    private final ClaimService claimService;

    // POST /api/v1/claims
    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> submitClaim(
            @Valid @RequestBody CreateClaimRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Claim submission from: {}", userDetails.getUsername());
        ClaimResponse response = claimService.submitClaim(request, 1L);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Claim submitted successfully"));
    }

    // GET /api/v1/claims/my-claims
    @GetMapping("/my-claims")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getMyClaims(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                ApiResponse.success(claimService.getMyClaims(1L)));
    }

    // GET /api/v1/claims/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(claimService.getClaimById(id)));
    }

    // GET /api/v1/claims
    @GetMapping
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getAllClaims() {

        return ResponseEntity.ok(
                ApiResponse.success(claimService.getAllClaims()));
    }

    // PUT /api/v1/claims/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ClaimResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam ClaimStatus status,
            @RequestParam(required = false) String notes) {

        ClaimResponse response = claimService.updateClaimStatus(id, status, notes);
        return ResponseEntity.ok(
                ApiResponse.success(response, "Claim status updated"));
    }
}