package com.kce.project.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kce.project.dto.response.StudentDashboardResponseDTO;
import com.kce.project.entity.AIRecommendation;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.Student;
import com.kce.project.repository.AIRecommendationRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.service.StudentDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentDashboardServiceImpl implements StudentDashboardService {

    private final StudentRepository studentRepository;

    private final AssessmentResultRepository resultRepository;

    private final StudentProgressRepository progressRepository;

    private final AIRecommendationRepository recommendationRepository;

    private final AssignmentRepository assignmentRepository;

    @Override
    public StudentDashboardResponseDTO getDashboard(Long studentId) {

        // Step 1
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        // Step 2
        int completedAssignments = (int) progressRepository.findByStudentStudentId(studentId).stream()
                .filter(p -> p.getStatus() == com.kce.project.enums.SimulationStatus.COMPLETED)
                .count();

        // Only include assessment results tied to still-active assignments
        List<AssessmentResult> results =
                resultRepository.findByStudentStudentId(studentId)
                        .stream()
                        .filter(r -> r.getAssignment() != null && assignmentRepository.existsById(r.getAssignment().getAssignmentId()))
                        .collect(java.util.stream.Collectors.toList());

        // Step 4
        double average = 0;

        if (!results.isEmpty()) {
            average = results.stream()
                    .filter(r -> r.getPercentage() != null)
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0);
        }

        // Step 5
        List<AIRecommendation> recommendations =
                recommendationRepository.findByStudentStudentId(studentId);

        String latestRecommendation = "";

        if (!recommendations.isEmpty()) {
            latestRecommendation =
                    recommendations.get(recommendations.size() - 1)
                            .getRecommendation();
        }

        // Step 6
        int preparedness = (int) average;

        return StudentDashboardResponseDTO.builder()
                .studentId(student.getStudentId())
                .studentName(student.getUser().getFullName())
                .completedAssignments(completedAssignments)
                .completedAssessments(results.size())
                .averageScore(average)
                .preparedness(preparedness)
                .latestRecommendation(latestRecommendation)
                .build();
    }
}