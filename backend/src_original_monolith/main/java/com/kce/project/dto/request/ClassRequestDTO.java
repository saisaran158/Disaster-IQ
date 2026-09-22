package com.kce.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassRequestDTO {

    @NotBlank
    private String className;

    @NotBlank
    private String section;

    @NotBlank
    private String academicYear;

    @NotNull
    private Long schoolId;
}