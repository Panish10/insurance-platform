package com.insurance.user.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private UserResponse user;

    public static AuthResponse of(UserResponse user) {
        return AuthResponse.builder()
                .accessToken("JWT_TOKEN_PLACEHOLDER")
                .tokenType("Bearer")
                .expiresIn(86400)
                .user(user)
                .build();
    }
}