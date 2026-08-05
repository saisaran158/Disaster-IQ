package com.kce.project.service;

import com.kce.project.dto.request.QuestionOptionRequestDTO;
import com.kce.project.dto.response.QuestionOptionResponseDTO;

import java.util.List;

public interface QuestionOptionService {

    QuestionOptionResponseDTO createOption(QuestionOptionRequestDTO request);

    QuestionOptionResponseDTO getOption(Long optionId);

    List<QuestionOptionResponseDTO> getAllOptions();

    List<QuestionOptionResponseDTO> getOptionsByQuestion(Long questionId);

    QuestionOptionResponseDTO updateOption(Long optionId,
                                           QuestionOptionRequestDTO request);

    void deleteOption(Long optionId);

}