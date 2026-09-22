package com.kce.project.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kce.project.dto.response.ParentDashboardResponseDTO;
import com.kce.project.entity.AIRecommendation;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.Student;
import com.kce.project.repository.AIRecommendationRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.service.ParentDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParentDashboardServiceImpl
        implements ParentDashboardService {

    private final StudentRepository studentRepository;

    private final StudentProgressRepository progressRepository;

    private final AssessmentResultRepository resultRepository;

    private final AIRecommendationRepository recommendationRepository;

    @Override
    public ParentDashboardResponseDTO getDashboard(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        int completedAssignments =
                progressRepository.findByStudentStudentId(studentId).size();

        List<AssessmentResult> results =
                resultRepository.findByStudentStudentId(studentId);

        double average = 0;

        if (!results.isEmpty()) {
            average = results.stream()
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0);
        }

        List<AIRecommendation> recommendations =
                recommendationRepository.findByStudentStudentId(studentId);

        String latestRecommendation = "";

        if (!recommendations.isEmpty()) {
            latestRecommendation =
                    recommendations.get(recommendations.size() - 1)
                            .getRecommendation();
        }

        return ParentDashboardResponseDTO.builder()
                .studentId(student.getStudentId())
                .studentName(student.getUser().getFullName())
                .className(student.getSchoolClass().getClassName() + "-"
                        + student.getSchoolClass().getSection())
                .schoolName(student.getSchool().getSchoolName())
                .completedAssignments(completedAssignments)
                .completedAssessments(results.size())
                .averageScore(average)
                .latestRecommendation(latestRecommendation)
                .build();
    }
}