package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponseDTO {

    private Long questionId;

    private String questionText;

    private Long assessmentId;

    private String assessmentTitle;
}