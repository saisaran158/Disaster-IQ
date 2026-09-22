package com.kce.project.service;

import com.kce.project.dto.request.LoginRequestDTO;
import com.kce.project.dto.request.RegisterRequestDTO;
import com.kce.project.dto.request.UpdateProfileRequestDTO;
import com.kce.project.dto.response.LoginResponseDTO;
import com.kce.project.dto.response.RegisterResponseDTO;
import com.kce.project.dto.response.UserProfileResponseDTO;

public interface AuthService {

    RegisterResponseDTO register(RegisterRequestDTO request);

    LoginResponseDTO login(LoginRequestDTO request);

    UserProfileResponseDTO updateProfile(String email, UpdateProfileRequestDTO request);

    UserProfileResponseDTO getProfile(String email);

    java.util.Map<String, String> generateOtp(com.kce.project.dto.request.ForgotPasswordRequestDTO request);

    void resetPassword(com.kce.project.dto.request.ResetPasswordRequestDTO request);

}