package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOptionResponseDTO {

    private Long optionId;

    private String optionText;

    private Boolean correct;

    private Long questionId;

    private String questionText;
}