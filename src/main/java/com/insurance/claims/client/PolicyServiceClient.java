package com.insurance.claims.client;

import com.insurance.common.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "policy-service", configuration = FeignClientConfig.class)
public interface PolicyServiceClient {

    @GetMapping("/api/v1/policies/{id}")
    ApiResponse<Map<String, Object>> getPolicyById(@PathVariable Long id);
}