package com.kce.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.request.LoginRequestDTO;
import com.kce.project.dto.request.RegisterRequestDTO;
import com.kce.project.dto.request.UpdateProfileRequestDTO;
import com.kce.project.dto.response.LoginResponseDTO;
import com.kce.project.dto.response.RegisterResponseDTO;
import com.kce.project.dto.response.UserProfileResponseDTO;
import com.kce.project.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        RegisterResponseDTO response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(authService.getProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponseDTO> updateProfile(
            @RequestBody UpdateProfileRequestDTO request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserProfileResponseDTO updated = authService.updateProfile(email, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/forgot-password/otp")
    public ResponseEntity<java.util.Map<String, String>> generateOtp(
            @RequestBody com.kce.project.dto.request.ForgotPasswordRequestDTO request) {
        java.util.Map<String, String> response = authService.generateOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<java.util.Map<String, String>> resetPassword(
            @RequestBody com.kce.project.dto.request.ResetPasswordRequestDTO request) {
        authService.resetPassword(request);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Password reset successful.");
        return ResponseEntity.ok(response);
    }

}