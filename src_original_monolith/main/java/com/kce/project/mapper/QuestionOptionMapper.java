package com.kce.project.mapper;

import com.kce.project.dto.response.QuestionOptionResponseDTO;
import com.kce.project.entity.QuestionOption;
import org.springframework.stereotype.Component;

@Component
public class QuestionOptionMapper {

    public QuestionOptionResponseDTO toResponse(QuestionOption option){

        return QuestionOptionResponseDTO.builder()
                .optionId(option.getOptionId())
                .optionText(option.getOptionText())
                .correct(option.getCorrect())
                .questionId(option.getQuestion().getQuestionId())
                .questionText(option.getQuestion().getQuestionText())
                .build();
    }

}