package com.kce.project.mapper;

import com.kce.project.dto.response.QuestionResponseDTO;
import com.kce.project.entity.Question;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public QuestionResponseDTO toResponse(Question question){

        return QuestionResponseDTO.builder()
                .questionId(question.getQuestionId())
                .questionText(question.getQuestionText())
                .assessmentId(question.getAssessment().getAssessmentId())
                .assessmentTitle(question.getAssessment().getTitle())
                .build();
    }

}