package com.insurance.claims.repository;

import com.insurance.claims.entity.Claim;
import com.insurance.claims.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByUserId(Long userId);

    List<Claim> findByStatus(ClaimStatus status);

    List<Claim> findByUserIdAndStatus(Long userId, ClaimStatus status);

    List<Claim> findByPolicyId(Long policyId);

    boolean existsByUserIdAndPolicyIdAndStatus(Long userId,
                                               Long policyId,
                                               ClaimStatus status);
}