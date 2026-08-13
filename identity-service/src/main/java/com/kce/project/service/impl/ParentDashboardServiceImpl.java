package com.kce.project.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kce.project.dto.response.ParentDashboardResponseDTO;
import com.kce.project.entity.AIRecommendation;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.Student;
import com.kce.project.enums.SimulationStatus;
import com.kce.project.repository.AIRecommendationRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.AssignmentRepository;
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
    private final AssignmentRepository assignmentRepository;

    @Override
    public ParentDashboardResponseDTO getDashboard(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        long totalAssignments = 0;
        if (student.getSchoolClass() != null) {
            totalAssignments = assignmentRepository.countBySchoolClassClassId(student.getSchoolClass().getClassId());
        }

        long completedAssignments = progressRepository.countByStudentStudentIdAndStatus(studentId, SimulationStatus.COMPLETED);
        long pendingAssignments = totalAssignments - completedAssignments;
        if (pendingAssignments < 0) pendingAssignments = 0;

        List<AssessmentResult> results =
                resultRepository.findByStudentStudentId(studentId);

        double average = 0;

        if (!results.isEmpty()) {
            average = results.stream()
                    .filter(r -> r.getPercentage() != null)
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

        java.util.List<Double> assessmentScores = results.stream()
                .filter(r -> r.getPercentage() != null)
                .map(AssessmentResult::getPercentage)
                .collect(java.util.stream.Collectors.toList());

        return ParentDashboardResponseDTO.builder()
                .studentId(student.getStudentId())
                .studentName(student.getUser().getFullName())
                .className(student.getSchoolClass() != null ? (student.getSchoolClass().getClassName() + "-"
                        + student.getSchoolClass().getSection()) : "N/A")
                .schoolName(student.getSchool() != null ? student.getSchool().getSchoolName() : "N/A")
                .completedAssignments((int) completedAssignments)
                .completedAssessments(results.size())
                .totalAssignments((int) totalAssignments)
                .pendingAssignments((int) pendingAssignments)
                .averageScore(average)
                .assessmentScores(assessmentScores)
                .latestRecommendation(latestRecommendation)
                .build();
    }
}