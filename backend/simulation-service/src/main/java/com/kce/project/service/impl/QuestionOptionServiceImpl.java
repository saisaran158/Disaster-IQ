package com.kce.project.service.impl;

import com.kce.project.dto.request.QuestionOptionRequestDTO;
import com.kce.project.dto.response.QuestionOptionResponseDTO;
import com.kce.project.entity.Question;
import com.kce.project.entity.QuestionOption;
import com.kce.project.mapper.QuestionOptionMapper;
import com.kce.project.repository.QuestionOptionRepository;
import com.kce.project.repository.QuestionRepository;
import com.kce.project.service.QuestionOptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kce.project.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionOptionServiceImpl implements QuestionOptionService {

    private final QuestionOptionRepository optionRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionMapper optionMapper;

    @Override
    public QuestionOptionResponseDTO createOption(QuestionOptionRequestDTO request) {

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        QuestionOption option = QuestionOption.builder()
                .optionText(request.getOptionText())
                .correct(request.getCorrect())
                .question(question)
                .build();

        return optionMapper.toResponse(optionRepository.save(option));
    }

    @Override
    public QuestionOptionResponseDTO getOption(Long optionId) {

        QuestionOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Option not found"));

        return optionMapper.toResponse(option);
    }

    @Override
    public List<QuestionOptionResponseDTO> getAllOptions() {

        return optionRepository.findAll()
                .stream()
                .map(optionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionOptionResponseDTO> getOptionsByQuestion(Long questionId) {

        return optionRepository.findByQuestionQuestionId(questionId)
                .stream()
                .map(optionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuestionOptionResponseDTO updateOption(Long optionId,
                                                  QuestionOptionRequestDTO request) {

        QuestionOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Option not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        option.setOptionText(request.getOptionText());
        option.setCorrect(request.getCorrect());
        option.setQuestion(question);

        return optionMapper.toResponse(optionRepository.save(option));
    }

    @Override
    public void deleteOption(Long optionId) {

        QuestionOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Option not found"));

        optionRepository.delete(option);
    }
}