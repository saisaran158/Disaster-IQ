package com.kce.project.service.impl;

import com.kce.project.dto.request.QuestionRequestDTO;
import com.kce.project.dto.response.QuestionResponseDTO;
import com.kce.project.entity.Assessment;
import com.kce.project.entity.Question;
import com.kce.project.mapper.QuestionMapper;
import com.kce.project.repository.AssessmentRepository;
import com.kce.project.repository.QuestionRepository;
import com.kce.project.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kce.project.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionMapper questionMapper;

    @Override
    public QuestionResponseDTO createQuestion(QuestionRequestDTO request) {

        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));

        Question question = Question.builder()
                .questionText(request.getQuestionText())
                .assessment(assessment)
                .build();

        return questionMapper.toResponse(questionRepository.save(question));
    }

    @Override
    public QuestionResponseDTO getQuestionById(Long questionId) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        return questionMapper.toResponse(question);
    }

    @Override
    public List<QuestionResponseDTO> getAllQuestions() {

        return questionRepository.findAll()
                .stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionResponseDTO> getQuestionsByAssessment(Long assessmentId) {

        return questionRepository.findByAssessmentAssessmentId(assessmentId)
                .stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuestionResponseDTO updateQuestion(Long questionId,
                                              QuestionRequestDTO request) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));

        question.setQuestionText(request.getQuestionText());
        question.setAssessment(assessment);

        return questionMapper.toResponse(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long questionId) {

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        questionRepository.delete(question);
    }

}