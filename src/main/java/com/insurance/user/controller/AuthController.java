package com.insurance.user.controller;

import com.insurance.common.response.ApiResponse;
import com.insurance.user.dto.request.LoginRequest;
import com.insurance.user.dto.request.RegisterRequest;
import com.insurance.user.dto.response.AuthResponse;
import com.insurance.user.dto.response.UserResponse;
import com.insurance.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Register request received for: {}", request.getEmail());
        UserResponse response = userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        log.info("Login request received for: {}", request.getEmail());
        AuthResponse response = userService.login(request);
        return ResponseEntity
                .ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity
                .ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id) {
        return ResponseEntity
                .ok(ApiResponse.success(userService.getUserById(id)));
    }
}