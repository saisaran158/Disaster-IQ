package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResultResponseDTO {

    private Long resultId;

    private Integer score;

    private Integer totalMarks;

    private Double percentage;

    private Boolean passed;

    private String recommendation;

    private Long assignmentId;

}