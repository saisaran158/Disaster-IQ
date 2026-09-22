package com.kce.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOptionRequestDTO {

    @NotBlank(message = "Option text is required")
    private String optionText;

    @NotNull(message = "Correct field is required")
    private Boolean correct;

    @NotNull(message = "Question ID is required")
    private Long questionId;
}