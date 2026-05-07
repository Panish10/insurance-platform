package com.insurance.policy.repository;

import com.insurance.policy.entity.UserPolicy;
import com.insurance.policy.enums.PolicyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPolicyRepository extends JpaRepository<UserPolicy, Long> {

    List<UserPolicy> findByUserId(Long userId);

    List<UserPolicy> findByUserIdAndStatus(Long userId, PolicyStatus status);

    Optional<UserPolicy> findByUserIdAndPolicyId(Long userId, Long policyId);

    boolean existsByUserIdAndPolicyId(Long userId, Long policyId);
}