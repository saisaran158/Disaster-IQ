package com.kce.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "School ID is required")
    private Long schoolId;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotBlank(message = "Specialization is required")
    private String specialization;
}