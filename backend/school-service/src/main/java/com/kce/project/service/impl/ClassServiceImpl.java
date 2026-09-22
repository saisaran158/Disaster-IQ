package com.kce.project.service.impl;

import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.dto.request.ClassRequestDTO;
import com.kce.project.dto.response.ClassResponseDTO;
import com.kce.project.entity.School;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Teacher;
import com.kce.project.mapper.ClassMapper;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.exception.ResourceAlreadyExistsException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassServiceImpl implements ClassService {

    private final SchoolClassRepository classRepository;
    private final SchoolRepository schoolRepository;
    private final ClassMapper classMapper;
    private final com.kce.project.repository.TeacherRepository teacherRepository;
    private final com.kce.project.repository.UserRepository userRepository;
    private final AssessmentResultRepository assessmentResultRepository;
    private final com.kce.project.repository.AssignmentRepository assignmentRepository;

    private ClassResponseDTO mapToResponseWithAvgScore(SchoolClass schoolClass) {
        ClassResponseDTO dto = classMapper.toResponse(schoolClass);
        List<com.kce.project.entity.Assignment> assignments = assignmentRepository.findBySchoolClassClassId(schoolClass.getClassId());
        java.util.Set<Long> assignedSimulationIds = assignments.stream()
                .filter(a -> a.getSimulation() != null)
                .map(a -> a.getSimulation().getSimulationId())
                .collect(Collectors.toSet());

        List<AssessmentResult> results = assessmentResultRepository.findByStudentSchoolClassClassId(schoolClass.getClassId());
        double avg = 0.0;
        if (results != null && !results.isEmpty()) {
            avg = results.stream()
                .filter(r -> r.getPercentage() != null && r.getPercentage() > 0)
                .filter(r -> r.getAssignment() != null && assignmentRepository.existsById(r.getAssignment().getAssignmentId()))
                .mapToDouble(AssessmentResult::getPercentage)
                .average()
                .orElse(0.0);
        }
        // Round to nearest integer (or keep 1 decimal if needed, e.g. Math.round(avg))
        dto.setAverageScore(Math.round(avg));
        return dto;
    }

    @Override
    public ClassResponseDTO createClass(ClassRequestDTO request) {

        School school = schoolRepository.findById(request.getSchoolId())
                .orElse(null);

        if (school == null) {
            school = schoolRepository.findAll().stream().findFirst().orElse(null);
        }
        if (school == null) {
            school = schoolRepository.save(School.builder()
                    .schoolName("Default School")
                    .district("Coimbatore")
                    .state("Tamil Nadu")
                    .build());
        }

        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId()).orElse(null);
        }
        if (teacher == null) {
            try {
                String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
                var uOpt = userRepository.findByEmail(currentEmail);
                if (uOpt.isPresent() && uOpt.get().getRole() == com.kce.project.enums.Role.TEACHER) {
                    teacher = teacherRepository.findByUserUserId(uOpt.get().getUserId()).orElse(null);
                }
            } catch (Exception ex) {}
        }

        final Teacher finalTeacher = teacher;
        final String clsName = request.getClassName() != null ? request.getClassName().trim() : "Class";
        final String secName = request.getSection() != null ? request.getSection().trim() : "A";

        SchoolClass existingClass = classRepository.findAll().stream()
                .filter(c -> {
                    String cName = c.getClassName() != null ? c.getClassName().trim() : "";
                    String cSec = c.getSection() != null ? c.getSection().trim() : "";
                    boolean isNameMatch = cName.equalsIgnoreCase(clsName) && cSec.equalsIgnoreCase(secName);
                    if (!isNameMatch) return false;
                    if (finalTeacher != null && c.getTeacher() != null) {
                        return c.getTeacher().getTeacherId().equals(finalTeacher.getTeacherId());
                    }
                    return true;
                })
                .findFirst()
                .orElse(null);

        if (existingClass != null) {
            if (existingClass.getTeacher() == null && finalTeacher != null) {
                existingClass.setTeacher(finalTeacher);
                existingClass = classRepository.save(existingClass);
            }
            return mapToResponseWithAvgScore(existingClass);
        }

        SchoolClass schoolClass = SchoolClass.builder()
                .className(clsName)
                .section(secName)
                .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : "2025-2026")
                .school(school)
                .teacher(finalTeacher)
                .build();

        return mapToResponseWithAvgScore(
                classRepository.save(schoolClass));
    }

    @Override
    public List<ClassResponseDTO> getClassesByTeacher(Long teacherId) {
        return classRepository.findByTeacherTeacherId(teacherId)
                .stream()
                .map(this::mapToResponseWithAvgScore)
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponseDTO getClassById(Long classId) {

        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Class not found"));

        return mapToResponseWithAvgScore(schoolClass);
    }

    @Override
    public List<ClassResponseDTO> getAllClasses() {

        return classRepository.findAll()
                .stream()
                .map(this::mapToResponseWithAvgScore)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponseDTO> getClassesBySchool(Long schoolId) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        return classRepository.findBySchool(school)
                .stream()
                .map(this::mapToResponseWithAvgScore)
                .collect(Collectors.toList());
    }

    @Override
    public ClassResponseDTO updateClass(Long classId,
                                        ClassRequestDTO request) {

        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Class not found"));

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        schoolClass.setClassName(request.getClassName());
        schoolClass.setSection(request.getSection());
        schoolClass.setAcademicYear(request.getAcademicYear());
        schoolClass.setSchool(school);

        return mapToResponseWithAvgScore(
                classRepository.save(schoolClass));
    }

    @Override
    public void deleteClass(Long classId) {

        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Class not found"));

        classRepository.delete(schoolClass);
    }
}