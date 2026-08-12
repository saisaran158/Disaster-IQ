package com.kce.project.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.service.TeacherDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherDashboardServiceImpl implements TeacherDashboardService {

    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository classRepository;
    private final AssignmentRepository assignmentRepository;
    private final SimulationRepository simulationRepository;
    private final AssessmentResultRepository resultRepository;
    private final StudentProgressRepository progressRepository;
    private final StudentRepository studentRepository;

    @Override
    public TeacherDashboardResponseDTO getDashboard(Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        List<SchoolClass> classes = classRepository.findByTeacherTeacherId(teacherId);
        int totalClasses = classes.size();

        int totalStudents = classes.stream()
                .mapToInt(c -> c.getStudents().size())
                .sum();

        List<Assignment> assignments = assignmentRepository.findByTeacherTeacherId(teacherId);
        int totalAssignments = assignments.size();

        // Distinct simulations assigned by THIS teacher
        long totalSimulations = assignments.stream()
                .map(a -> a.getSimulation() != null ? a.getSimulation().getSimulationId() : null)
                .filter(id -> id != null)
                .distinct()
                .count();

        List<Simulation> ownedSimulations = simulationRepository.findByCreatedByTeacherId(teacherId);
        int totalAssessments = (int) ownedSimulations.stream()
                .map(Simulation::getAssessment)
                .filter(a -> a != null)
                .count();

        List<AssessmentResult> results = classes.stream()
                .flatMap(c -> resultRepository.findByStudentSchoolClassClassId(c.getClassId()).stream())
                .toList();

        double averageScore = 0;
        if (!results.isEmpty()) {
            averageScore = results.stream()
                    .filter(r -> r.getPercentage() != null && r.getPercentage() > 0)
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0);
        }

        int passedStudents = (int) results.stream().filter(AssessmentResult::getPassed).count();
        int failedStudents = (int) results.stream().filter(r -> !r.getPassed()).count();

        // Completed only when ALL students in the class have COMPLETED
        int completedAssignmentsCount = 0;
        for (Assignment asg : assignments) {
            Long classId = asg.getSchoolClass() != null ? asg.getSchoolClass().getClassId() : null;
            if (classId == null) continue;
            long totalStudentsInClass = studentRepository.countBySchoolClassClassId(classId);
            if (totalStudentsInClass == 0) continue;
            long completedStudents = progressRepository.countByAssignmentAssignmentIdAndStatus(
                    asg.getAssignmentId(), com.kce.project.enums.SimulationStatus.COMPLETED);
            if (completedStudents >= totalStudentsInClass) {
                completedAssignmentsCount++;
            }
        }

        return TeacherDashboardResponseDTO.builder()
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getUser().getFullName())
                .totalClasses(totalClasses)
                .totalStudents(totalStudents)
                .totalAssignments(totalAssignments)
                .totalSimulations((int) totalSimulations)
                .totalAssessments(totalAssessments)
                .averageScore(averageScore)
                .completedAssignments(completedAssignmentsCount)
                .passedStudents(passedStudents)
                .failedStudents(failedStudents)
                .build();
    }
}
