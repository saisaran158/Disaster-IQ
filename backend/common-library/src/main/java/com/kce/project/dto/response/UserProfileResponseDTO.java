package com.kce.project.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponseDTO {
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String role;
}