package com.insurance.policy.controller;

import com.insurance.common.response.ApiResponse;
import com.insurance.policy.dto.request.CreatePolicyRequest;
import com.insurance.policy.dto.response.PolicyResponse;
import com.insurance.policy.dto.response.UserPolicyResponse;
import com.insurance.policy.service.PolicyService;
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
@RequestMapping("/api/v1/policies")
@RequiredArgsConstructor
@Slf4j
public class PolicyController {

    private final PolicyService policyService;

    // POST /api/v1/policies
    @PostMapping
    public ResponseEntity<ApiResponse<PolicyResponse>> createPolicy(
            @Valid @RequestBody CreatePolicyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("Create policy request from: {}", userDetails.getUsername());
        Long userId = extractUserId(userDetails);
        PolicyResponse response = policyService.createPolicy(request, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Policy created successfully"));
    }

    // GET /api/v1/policies
    @GetMapping
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getAllPolicies() {
        return ResponseEntity.ok(
                ApiResponse.success(policyService.getAllPolicies()));
    }

    // GET /api/v1/policies/active
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getActivePolicies() {
        return ResponseEntity.ok(
                ApiResponse.success(policyService.getActivePolicies()));
    }

    // GET /api/v1/policies/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PolicyResponse>> getPolicyById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success(policyService.getPolicyById(id)));
    }

    // POST /api/v1/policies/{id}/subscribe
    @PostMapping("/{id}/subscribe")
    public ResponseEntity<ApiResponse<UserPolicyResponse>> subscribe(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = extractUserId(userDetails);
        UserPolicyResponse response = policyService.subscribeToPolicy(id, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Subscribed successfully"));
    }

    // GET /api/v1/policies/my-policies
    @GetMapping("/my-policies")
    public ResponseEntity<ApiResponse<List<UserPolicyResponse>>> getMyPolicies(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = extractUserId(userDetails);
        return ResponseEntity.ok(
                ApiResponse.success(policyService.getUserPolicies(userId)));
    }

    // helper — extract userId from JWT subject
    // in Phase 5 we will pass userId directly in JWT claims
    private Long extractUserId(UserDetails userDetails) {
        // for now we use a fixed value
        // in next step we update JwtService to include userId in token
        return 1L;
    }
}