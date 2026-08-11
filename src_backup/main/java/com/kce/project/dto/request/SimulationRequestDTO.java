package com.kce.project.dto.request;

import com.kce.project.enums.DisasterType;
import com.kce.project.enums.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Disaster Type is required")
    private DisasterType disasterType;

    @NotNull(message = "Difficulty Level is required")
    private DifficultyLevel difficulty;

    @NotNull(message = "Duration is required")
    private Integer duration;

    private String thumbnail;

    @NotNull(message = "Teacher ID is required")
    private Long teacherId;

    private Boolean active;
}