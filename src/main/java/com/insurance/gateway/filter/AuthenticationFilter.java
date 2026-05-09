package com.insurance.gateway.filter;

import com.insurance.gateway.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class AuthenticationFilter extends
        AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final JwtService jwtService;

    // public endpoints that do not need a token
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/actuator"
    );

    public AuthenticationFilter(JwtService jwtService) {
        super(Config.class);
        this.jwtService = jwtService;
    }

    @Override
    public String name() {
        return "Authentication";
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().toString();

            log.debug("Gateway request: {}", path);

            // skip token check for public endpoints
            if (isPublicEndpoint(path)) {
                return chain.filter(exchange);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null) {
                log.warn("No Authorization header for path: {}", path);
                return onError(exchange, HttpStatus.UNAUTHORIZED);
            }

            if (!authHeader.startsWith("Bearer ")) {
                log.warn("Invalid Authorization header format");
                return onError(exchange, HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            // validate token
            if (!jwtService.isTokenValid(token)) {
                log.warn("Invalid or expired JWT token");
                return onError(exchange, HttpStatus.UNAUTHORIZED);
            }

            // add email to request header so downstream services know who the user is
            String email = jwtService.extractEmail(token);
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Email", email)
                    .build();

            log.debug("JWT valid for user: {}", email);
            return chain.filter(exchange.mutate()
                    .request(modifiedRequest).build());
        };
    }

    private boolean isPublicEndpoint(String path) {
        return PUBLIC_ENDPOINTS.stream()
                .anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange,
                               HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    public static class Config {
        // configuration properties if needed
    }
}