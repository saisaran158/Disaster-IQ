package com.kce.project.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentSubmissionDTO {

    private Long studentId;

    private Long assessmentId;

    private Long assignmentId;

    private List<StudentAnswerDTO> answers;

}