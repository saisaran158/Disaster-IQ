package com.kce.project.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequestDTO {
    private String email;
    private String otp;
    private String newPassword;
}