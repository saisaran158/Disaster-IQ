package com.kce.project.service.impl;

import org.springframework.stereotype.Service;

import com.kce.project.dto.request.AssessmentSubmissionDTO;
import com.kce.project.dto.request.StudentAnswerDTO;
import com.kce.project.dto.response.AssessmentResultResponseDTO;
import com.kce.project.entity.AIRecommendation;
import com.kce.project.entity.Assessment;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.Question;
import com.kce.project.entity.QuestionOption;
import com.kce.project.entity.Student;
import com.kce.project.entity.StudentAnswer;
import com.kce.project.repository.AIRecommendationRepository;
import com.kce.project.repository.AssessmentRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.QuestionOptionRepository;
import com.kce.project.repository.QuestionRepository;
import com.kce.project.repository.StudentAnswerRepository;
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.service.AssessmentEngineService;
import org.springframework.transaction.annotation.Transactional;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.exception.BadRequestException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AssessmentEngineServiceImpl implements AssessmentEngineService {

	private final StudentRepository studentRepository;

	private final AssessmentRepository assessmentRepository;

	private final QuestionRepository questionRepository;

	private final QuestionOptionRepository optionRepository;

	private final AssessmentResultRepository resultRepository;

	private final StudentAnswerRepository answerRepository;

	private final StudentProgressRepository progressRepository;

	private final AIRecommendationRepository recommendationRepository;

	@Override
	public AssessmentResultResponseDTO submitAssessment(AssessmentSubmissionDTO request) {

		Student student = studentRepository.findById(request.getStudentId())
				.orElseThrow(() -> new ResourceNotFoundException("Student not found"));

		Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
				.orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));

		int score = 0;

		int totalQuestions = questionRepository.findByAssessmentAssessmentId(assessment.getAssessmentId()).size();
		if (totalQuestions == 0) {
			throw new BadRequestException("Assessment has no questions configured.");
		}

		// Create AssessmentResult first
		AssessmentResult result = AssessmentResult.builder().student(student).assessment(assessment).score(0)
				.totalMarks(assessment.getTotalMarks()).percentage(0.0).passed(false).build();

		result = resultRepository.save(result);

		java.util.Set<Long> processedQuestions = new java.util.HashSet<>();

		// Evaluate each answer
		for (StudentAnswerDTO dto : request.getAnswers()) {

			Question question = questionRepository.findById(dto.getQuestionId())
					.orElseThrow(() -> new ResourceNotFoundException("Question not found"));

			if (!question.getAssessment().getAssessmentId().equals(assessment.getAssessmentId())) {
				throw new BadRequestException("Question ID " + dto.getQuestionId() + " does not belong to Assessment ID " + assessment.getAssessmentId());
			}

			if (processedQuestions.contains(dto.getQuestionId())) {
				throw new BadRequestException("Duplicate answer submitted for Question ID " + dto.getQuestionId());
			}
			processedQuestions.add(dto.getQuestionId());

			QuestionOption selectedOption = optionRepository.findById(dto.getSelectedOptionId())
					.orElseThrow(() -> new ResourceNotFoundException("Selected option not found"));

			if (!selectedOption.getQuestion().getQuestionId().equals(question.getQuestionId())) {
				throw new BadRequestException("Option ID " + dto.getSelectedOptionId() + " does not belong to Question ID " + question.getQuestionId());
			}

			// Check answer
			if (Boolean.TRUE.equals(selectedOption.getCorrect())) {
				score++;
			}

			// Save Student Answer
			StudentAnswer answer = StudentAnswer.builder().assessmentResult(result).question(question)
					.selectedOption(selectedOption).build();

			answerRepository.save(answer);
		}

		double percentage = ((double) score / totalQuestions) * 100;

		double passingPercentage = 0.0;
		if (assessment.getTotalMarks() > 0) {
			passingPercentage = ((double) assessment.getPassingMarks() / assessment.getTotalMarks()) * 100;
		}
		boolean passed = percentage >= passingPercentage;

		result.setScore(score);
		result.setPercentage(percentage);
		result.setPassed(passed);

		resultRepository.save(result);

		String recommendation;

		if (percentage >= 90) {

			recommendation = "Excellent performance! Try advanced disaster simulations.";

		} else if (percentage >= 70) {

			recommendation = "Good work! Continue practicing with additional simulations.";

		} else if (percentage >= 50) {

			recommendation = "Review the learning materials and retake the assessment.";

		} else {

			recommendation = "You need more practice. Revisit the simulation before attempting again.";

		}

		AIRecommendation aiRecommendation = AIRecommendation.builder().student(student)
				.simulation(assessment.getSimulation()).recommendation(recommendation).build();

		recommendationRepository.save(aiRecommendation);

		return AssessmentResultResponseDTO.builder().resultId(result.getResultId()).score(result.getScore())
				.totalMarks(result.getTotalMarks()).percentage(result.getPercentage()).passed(result.getPassed())
				.recommendation(recommendation).build();
	}

}