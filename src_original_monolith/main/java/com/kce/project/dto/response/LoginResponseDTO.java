package com.kce.project.dto.response;

import com.kce.project.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {

    private String token;

    private Long userId;

    private String fullName;

    private String email;

    private Role role;

}