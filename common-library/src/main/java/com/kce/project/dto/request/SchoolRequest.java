package com.kce.project.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolRequest {

    @NotBlank(message = "School name is required")
    private String schoolName;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    private String address;

    private String pincode;

    private String phone;

    @Email(message = "Invalid email")
    private String email;
}