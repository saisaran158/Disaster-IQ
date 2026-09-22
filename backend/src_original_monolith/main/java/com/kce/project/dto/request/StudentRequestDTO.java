package com.kce.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "School ID is required")
    private Long schoolId;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotBlank(message = "Roll Number is required")
    private String rollNumber;

    @NotBlank(message = "Admission Number is required")
    private String admissionNumber;
}