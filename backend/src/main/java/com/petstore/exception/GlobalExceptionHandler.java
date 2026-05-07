package com.petstore.exception;

import jakarta.persistence.EntityNotFoundException;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Data
    @Builder
    public static class ErrorResponse {
        private String error;
        private String message;
        private List<Violation> violations;
        private String path;
        private OffsetDateTime timestamp;
    }

    @Data
    @Builder
    public static class Violation {
        private String field;
        private String message;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        List<Violation> violations = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> Violation.builder().field(error.getField()).message(error.getDefaultMessage()).build())
                .collect(Collectors.toList());

        return ResponseEntity.badRequest().body(ErrorResponse.builder()
                .error("VALIDATION_ERROR")
                .message("Validation failed")
                .violations(violations)
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(OffsetDateTime.now())
                .build());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                .error("NOT_FOUND")
                .message(ex.getMessage())
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(OffsetDateTime.now())
                .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorResponse.builder()
                .error("INTERNAL_ERROR")
                .message("An unexpected error occurred")
                .path(request.getDescription(false).replace("uri=", ""))
                .timestamp(OffsetDateTime.now())
                .build());
    }
}
