package com.kce.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Total Marks is required")
    private Integer totalMarks;

    @NotNull(message = "Passing Marks is required")
    private Integer passingMarks;

    @NotNull(message = "Duration is required")
    private Integer duration;

    @NotNull(message = "Simulation ID is required")
    private Long simulationId;
}