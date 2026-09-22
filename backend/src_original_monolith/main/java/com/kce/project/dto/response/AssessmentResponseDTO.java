package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResponseDTO {

    private Long assessmentId;

    private String title;

    private Integer totalMarks;

    private Integer passingMarks;

    private Integer duration;

    private Long simulationId;

    private String simulationTitle;
}