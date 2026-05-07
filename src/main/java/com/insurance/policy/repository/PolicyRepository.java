package com.insurance.policy.repository;

import com.insurance.policy.entity.Policy;
import com.insurance.policy.enums.PolicyStatus;
import com.insurance.policy.enums.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    List<Policy> findByStatus(PolicyStatus status);

    List<Policy> findByPolicyType(PolicyType policyType);

    List<Policy> findByStatusAndPolicyType(PolicyStatus status,
                                           PolicyType policyType);

    boolean existsByNameAndPolicyType(String name, PolicyType policyType);
}