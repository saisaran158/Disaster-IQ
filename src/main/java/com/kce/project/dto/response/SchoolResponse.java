package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolResponse {

    private Long schoolId;

    private String schoolName;

    private String district;

    private String state;

    private String address;

    private String pincode;

    private String phone;

    private String email;
}