package com.insurance.policy.service;

import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.policy.dto.request.CreatePolicyRequest;
import com.insurance.policy.dto.response.PolicyResponse;
import com.insurance.policy.dto.response.UserPolicyResponse;
import com.insurance.policy.entity.Policy;
import com.insurance.policy.entity.UserPolicy;
import com.insurance.policy.enums.PolicyStatus;
import com.insurance.policy.repository.PolicyRepository;
import com.insurance.policy.repository.UserPolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final UserPolicyRepository userPolicyRepository;

    // ----------------------------------------------------------------
    // CREATE POLICY
    // ----------------------------------------------------------------
    @Transactional
    public PolicyResponse createPolicy(CreatePolicyRequest request,
                                       Long adminUserId) {
        log.info("Creating policy: {} by user: {}", request.getName(), adminUserId);

        if (policyRepository.existsByNameAndPolicyType(
                request.getName(), request.getPolicyType())) {
            throw new BusinessException(
                    "Policy already exists with this name and type",
                    "POLICY_ALREADY_EXISTS",
                    HttpStatus.CONFLICT
            );
        }

        Policy policy = Policy.builder()
                .name(request.getName())
                .description(request.getDescription())
                .policyType(request.getPolicyType())
                .status(PolicyStatus.ACTIVE)
                .premium(request.getPremium())
                .coverageAmount(request.getCoverageAmount())
                .durationMonths(request.getDurationMonths())
                .createdByUserId(adminUserId)
                .build();

        Policy saved = policyRepository.save(policy);
        log.info("Policy created with id: {}", saved.getId());
        return mapToPolicyResponse(saved);
    }

    // ----------------------------------------------------------------
    // GET ALL POLICIES
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<PolicyResponse> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(this::mapToPolicyResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // GET POLICY BY ID
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public PolicyResponse getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Policy", "id", id));
        return mapToPolicyResponse(policy);
    }

    // ----------------------------------------------------------------
    // GET ACTIVE POLICIES
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<PolicyResponse> getActivePolicies() {
        return policyRepository.findByStatus(PolicyStatus.ACTIVE)
                .stream()
                .map(this::mapToPolicyResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // SUBSCRIBE TO POLICY
    // ----------------------------------------------------------------
    @Transactional
    public UserPolicyResponse subscribeToPolicy(Long policyId, Long userId) {
        log.info("User {} subscribing to policy {}", userId, policyId);

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Policy", "id", policyId));

        if (policy.getStatus() != PolicyStatus.ACTIVE) {
            throw new BusinessException(
                    "Policy is not active",
                    "POLICY_NOT_ACTIVE",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (userPolicyRepository.existsByUserIdAndPolicyId(userId, policyId)) {
            throw new BusinessException(
                    "User already subscribed to this policy",
                    "ALREADY_SUBSCRIBED",
                    HttpStatus.CONFLICT
            );
        }

        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusMonths(policy.getDurationMonths());

        UserPolicy userPolicy = UserPolicy.builder()
                .userId(userId)
                .policy(policy)
                .status(PolicyStatus.ACTIVE)
                .startDate(startDate)
                .endDate(endDate)
                .build();

        UserPolicy saved = userPolicyRepository.save(userPolicy);
        log.info("User {} subscribed to policy {} successfully", userId, policyId);
        return mapToUserPolicyResponse(saved);
    }

    // ----------------------------------------------------------------
    // GET USER POLICIES
    // ----------------------------------------------------------------
    @Transactional(readOnly = true)
    public List<UserPolicyResponse> getUserPolicies(Long userId) {
        return userPolicyRepository.findByUserId(userId)
                .stream()
                .map(this::mapToUserPolicyResponse)
                .collect(Collectors.toList());
    }

    // ----------------------------------------------------------------
    // PRIVATE MAPPERS
    // ----------------------------------------------------------------
    private PolicyResponse mapToPolicyResponse(Policy policy) {
        return PolicyResponse.builder()
                .id(policy.getId())
                .name(policy.getName())
                .description(policy.getDescription())
                .policyType(policy.getPolicyType())
                .status(policy.getStatus())
                .premium(policy.getPremium())
                .coverageAmount(policy.getCoverageAmount())
                .durationMonths(policy.getDurationMonths())
                .createdByUserId(policy.getCreatedByUserId())
                .createdAt(policy.getCreatedAt())
                .build();
    }

    private UserPolicyResponse mapToUserPolicyResponse(UserPolicy userPolicy) {
        return UserPolicyResponse.builder()
                .id(userPolicy.getId())
                .userId(userPolicy.getUserId())
                .policy(mapToPolicyResponse(userPolicy.getPolicy()))
                .status(userPolicy.getStatus())
                .startDate(userPolicy.getStartDate())
                .endDate(userPolicy.getEndDate())
                .subscribedAt(userPolicy.getSubscribedAt())
                .build();
    }
}