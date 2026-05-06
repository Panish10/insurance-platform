package com.insurance.common.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ErrorResponse {

    private int status;
    private String message;
    private String errorCode;
    private String path;
    private Map<String, String> validationErrors;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static ErrorResponse of(int status, String message,
                                   String errorCode, String path) {
        return ErrorResponse.builder()
                .status(status)
                .message(message)
                .errorCode(errorCode)
                .path(path)
                .build();
    }

    public static ErrorResponse ofValidation(Map<String, String> errors,
                                             String path) {
        return ErrorResponse.builder()
                .status(400)
                .message("Validation failed")
                .errorCode("VALIDATION_ERROR")
                .validationErrors(errors)
                .path(path)
                .build();
    }
}