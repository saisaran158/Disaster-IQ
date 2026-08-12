package com.kce.project.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kce.project.dto.response.TeacherDashboardResponseDTO;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.Assignment;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Simulation;
import com.kce.project.entity.Teacher;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SimulationRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.service.TeacherDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherDashboardServiceImpl implements TeacherDashboardService {

    private final TeacherRepository teacherRepository;

    private final SchoolClassRepository classRepository;

    private final AssignmentRepository assignmentRepository;

    private final SimulationRepository simulationRepository;

    private final AssessmentResultRepository resultRepository;

    @Override
    public TeacherDashboardResponseDTO getDashboard(Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        // Total Classes
        List<SchoolClass> classes =
                classRepository.findByTeacherTeacherId(teacherId);

        int totalClasses = classes.size();

        // Total Students
        int totalStudents = classes.stream()
                .mapToInt(c -> c.getStudents().size())
                .sum();

        // Total Assignments
        List<Assignment> assignments =
                assignmentRepository.findByTeacherTeacherId(teacherId);

        int totalAssignments = assignments.size();

        // Total Simulations
        List<Simulation> simulations =
        		simulationRepository.findByCreatedByTeacherId(teacherId);

        int totalSimulations = simulations.size();

        // Total Assessments
        int totalAssessments = simulations.stream()
                .map(Simulation::getAssessment)
                .filter(a -> a != null)
                .toList()
                .size();

        // Assessment Results
        List<AssessmentResult> results =
                resultRepository.findAll();

        double averageScore = 0;

        if (!results.isEmpty()) {
            averageScore = results.stream()
                    .filter(r -> r.getPercentage() != null && r.getPercentage() > 0)
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0);
        }

        int passedStudents =
                (int) results.stream()
                        .filter(AssessmentResult::getPassed)
                        .count();

        int failedStudents =
                (int) results.stream()
                        .filter(r -> !r.getPassed())
                        .count();

        return TeacherDashboardResponseDTO.builder()
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getUser().getFullName())
                .totalClasses(totalClasses)
                .totalStudents(totalStudents)
                .totalAssignments(totalAssignments)
                .totalSimulations(totalSimulations)
                .totalAssessments(totalAssessments)
                .averageScore(averageScore)
                .passedStudents(passedStudents)
                .failedStudents(failedStudents)
                .build();
    }
}