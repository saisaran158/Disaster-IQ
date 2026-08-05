package com.kce.project.service;

import com.kce.project.dto.request.QuestionRequestDTO;
import com.kce.project.dto.response.QuestionResponseDTO;

import java.util.List;

public interface QuestionService {

    QuestionResponseDTO createQuestion(QuestionRequestDTO request);

    QuestionResponseDTO getQuestionById(Long questionId);

    List<QuestionResponseDTO> getAllQuestions();

    List<QuestionResponseDTO> getQuestionsByAssessment(Long assessmentId);

    QuestionResponseDTO updateQuestion(Long questionId,
                                       QuestionRequestDTO request);

    void deleteQuestion(Long questionId);

}