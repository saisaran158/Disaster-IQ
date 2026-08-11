package com.kce.project.dto.response;

import com.kce.project.enums.DisasterType;
import com.kce.project.enums.DifficultyLevel;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulationResponseDTO {

    private Long simulationId;

    private String title;

    private String description;

    private DisasterType disasterType;

    private DifficultyLevel difficulty;

    private Integer duration;

    private String thumbnail;

    private Boolean active;

    private Long teacherId;

    private String teacherName;
}