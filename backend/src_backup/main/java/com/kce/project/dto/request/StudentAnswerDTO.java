package com.kce.project.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswerDTO {

    private Long questionId;

    private Long selectedOptionId;

}