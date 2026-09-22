package com.kce.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

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
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.TeacherRepository;
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

        // Auto-associate unassigned classes in the same school
        if (teacher.getSchool() != null) {
            List<SchoolClass> schoolClasses = classRepository.findBySchoolSchoolId(teacher.getSchool().getSchoolId());
            for (SchoolClass sc : schoolClasses) {
                if (sc.getTeacher() == null) {
                    sc.setTeacher(teacher);
                    classRepository.save(sc);
                }
            }
        }

        List<SchoolClass> classes = classRepository.findByTeacherTeacherId(teacherId);
        int totalClasses = classes.size();

        // Strictly query students mapped to this teacher (1-to-1 mapping)
        List<com.kce.project.entity.Student> teacherStudents = studentRepository.findAll().stream()
                .filter(s -> {
                    if (s.getTeacher() != null && teacherId.equals(s.getTeacher().getTeacherId())) return true;
                    if (s.getSchoolClass() != null && s.getSchoolClass().getTeacher() != null && teacherId.equals(s.getSchoolClass().getTeacher().getTeacherId())) return true;
                    return false;
                })
                .toList();

        int totalStudents = teacherStudents.size();
        java.util.Set<Long> teacherStudentIds = teacherStudents.stream()
                .map(com.kce.project.entity.Student::getStudentId)
                .collect(java.util.stream.Collectors.toSet());

        List<Assignment> assignments = assignmentRepository.findByTeacherTeacherId(teacherId);
        int totalAssignments = assignments.size();

        // Total assigned simulations by this teacher
        int totalSimulationsCount = assignments.size();

        List<Simulation> ownedSimulations = simulationRepository.findByCreatedByTeacherId(teacherId);
        int totalAssessments = (int) ownedSimulations.stream()
                .map(Simulation::getAssessment)
                .filter(a -> a != null)
                .count();

        // Strictly query assessment results for this teacher's students only
        List<AssessmentResult> results = resultRepository.findAll().stream()
                .filter(r -> r.getStudent() != null && teacherStudentIds.contains(r.getStudent().getStudentId()))
                .toList();

        double averageScore = 0;
        if (!results.isEmpty()) {
            averageScore = results.stream()
                    .filter(r -> r.getPercentage() != null && r.getPercentage() > 0)
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0);
        }

        int passedStudents = (int) results.stream().filter(r -> Boolean.TRUE.equals(r.getPassed())).count();
        int failedStudents = (int) results.stream().filter(r -> Boolean.FALSE.equals(r.getPassed())).count();

        // Completed assignments count: count assignments where ALL enrolled students of that class under this teacher have completed the simulation
        int completedAssignmentsCount = 0;
        for (Assignment a : assignments) {
            List<com.kce.project.entity.Student> enrolledStudents = teacherStudents.stream()
                    .filter(st -> {
                        if (a.getSchoolClass() != null && st.getSchoolClass() != null) {
                            if (a.getSchoolClass().getClassId() != null && a.getSchoolClass().getClassId().equals(st.getSchoolClass().getClassId())) {
                                return true;
                            }
                            String asgCls = a.getSchoolClass().getClassName() != null ? a.getSchoolClass().getClassName().trim() : "";
                            String asgSec = a.getSchoolClass().getSection() != null ? a.getSchoolClass().getSection().trim() : "";
                            String stdCls = st.getSchoolClass().getClassName() != null ? st.getSchoolClass().getClassName().trim() : "";
                            String stdSec = st.getSchoolClass().getSection() != null ? st.getSchoolClass().getSection().trim() : "";
                            return !asgCls.isEmpty() && asgCls.equalsIgnoreCase(stdCls) && asgSec.equalsIgnoreCase(stdSec);
                        }
                        return false;
                    })
                    .toList();

            long completedCount = enrolledStudents.stream()
                    .filter(st -> {
                        boolean inProgress = progressRepository.findByStudentStudentIdAndAssignmentAssignmentId(
                                st.getStudentId(), a.getAssignmentId())
                                .map(p -> p.getStatus() == com.kce.project.enums.SimulationStatus.COMPLETED)
                                .orElse(false);
                        if (inProgress) return true;
                        return results.stream().anyMatch(r -> r.getStudent() != null && r.getStudent().getStudentId().equals(st.getStudentId())
                                && r.getAssignment() != null && a.getAssignmentId().equals(r.getAssignment().getAssignmentId()));
                    })
                    .count();

            if (!enrolledStudents.isEmpty() && completedCount >= enrolledStudents.size()) {
                completedAssignmentsCount++;
            } else if (enrolledStudents.isEmpty()) {
                long anyCompleted = progressRepository.countByAssignmentAssignmentIdAndStatus(
                        a.getAssignmentId(), com.kce.project.enums.SimulationStatus.COMPLETED);
                if (anyCompleted > 0) completedAssignmentsCount++;
            }
        }

        return TeacherDashboardResponseDTO.builder()
                .teacherId(teacher.getTeacherId())
                .teacherName(teacher.getUser().getFullName())
                .totalClasses(totalClasses)
                .totalStudents(totalStudents)
                .totalAssignments(totalAssignments)
                .totalSimulations(totalSimulationsCount)
                .totalAssessments(totalAssessments)
                .averageScore(averageScore)
                .completedAssignments(completedAssignmentsCount)
                .passedStudents(passedStudents)
                .failedStudents(failedStudents)
                .build();
    }
}
