package com.kce.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kce.project.dto.request.StudentRequestDTO;
import com.kce.project.dto.response.StudentResponseDTO;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.School;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Student;
import com.kce.project.entity.User;
import com.kce.project.enums.SimulationStatus;
import com.kce.project.exception.ResourceAlreadyExistsException;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.mapper.StudentMapper;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.service.StudentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentMapper studentMapper;
    private final AssessmentResultRepository assessmentResultRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentProgressRepository studentProgressRepository;

    private StudentResponseDTO mapToResponseWithMetrics(Student student) {
        StudentResponseDTO dto = studentMapper.toResponse(student);
        
        // 1. Calculate Average Score
        try {
            List<AssessmentResult> results = assessmentResultRepository.findByStudentStudentId(student.getStudentId());
            double avg = 0.0;
            if (results != null && !results.isEmpty()) {
                avg = results.stream()
                    .filter(r -> r.getPercentage() != null)
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0.0);
            }
            dto.setAverageScore((double) Math.round(avg));
        } catch (Exception e) {
            dto.setAverageScore(0.0);
        }

        // 2. Calculate Completion Rate & Assigned Count
        try {
            long totalAssignments = 0;
            long completedAssignments = 0;

            String clsName = "";
            String secName = "";

            if (student.getSchoolClass() != null) {
                Long cId = student.getSchoolClass().getClassId();
                totalAssignments = assignmentRepository.countBySchoolClassClassId(cId);
                clsName = student.getSchoolClass().getClassName() != null ? student.getSchoolClass().getClassName().trim() : "";
                secName = student.getSchoolClass().getSection() != null ? student.getSchoolClass().getSection().trim() : "";
            }

            if (totalAssignments == 0) {
                final String targetCls = clsName;
                final String targetSec = secName;
                List<com.kce.project.entity.Assignment> allAsg = assignmentRepository.findAll();
                if (!targetCls.isEmpty()) {
                    totalAssignments = allAsg.stream()
                        .filter(a -> a.getSchoolClass() != null
                            && targetCls.equalsIgnoreCase(a.getSchoolClass().getClassName() != null ? a.getSchoolClass().getClassName().trim() : "")
                            && targetSec.equalsIgnoreCase(a.getSchoolClass().getSection() != null ? a.getSchoolClass().getSection().trim() : ""))
                        .count();
                }
                if (totalAssignments == 0) {
                    totalAssignments = allAsg.size();
                }
            }

            completedAssignments = studentProgressRepository.countByStudentStudentIdAndStatus(student.getStudentId(), SimulationStatus.COMPLETED);
            if (completedAssignments == 0) {
                List<AssessmentResult> results = assessmentResultRepository.findByStudentStudentId(student.getStudentId());
                if (results != null && !results.isEmpty()) {
                    completedAssignments = results.stream().map(r -> r.getAssessment() != null ? r.getAssessment().getAssessmentId() : null).filter(java.util.Objects::nonNull).distinct().count();
                }
            }

            dto.setCompletionRate(completedAssignments + "/" + (totalAssignments > 0 ? totalAssignments : 1));
        } catch (Exception e) {
            dto.setCompletionRate("0/0");
        }

        try {
            if (student.getTeacher() != null) {
                dto.setTeacherId(student.getTeacher().getTeacherId());
                if (student.getTeacher().getUser() != null) {
                    dto.setTeacherName(student.getTeacher().getUser().getFullName());
                }
            } else if (student.getSchoolClass() != null && student.getSchoolClass().getTeacher() != null) {
                dto.setTeacherId(student.getSchoolClass().getTeacher().getTeacherId());
                if (student.getSchoolClass().getTeacher().getUser() != null) {
                    dto.setTeacherName(student.getSchoolClass().getTeacher().getUser().getFullName());
                }
            }
        } catch (Exception e) {}

        return dto;
    }

    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Class not found"));

        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new ResourceAlreadyExistsException("Roll Number already exists");
        }

        if (studentRepository.existsByAdmissionNumber(request.getAdmissionNumber())) {
            throw new ResourceAlreadyExistsException("Admission Number already exists");
        }

        Student student = Student.builder()
                .user(user)
                .school(school)
                .schoolClass(schoolClass)
                .rollNumber(request.getRollNumber())
                .admissionNumber(request.getAdmissionNumber())
                .build();

        return mapToResponseWithMetrics(studentRepository.save(student));
    }

    @Override
    public StudentResponseDTO getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        return mapToResponseWithMetrics(student);
    }

    @Override
    public List<StudentResponseDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponseWithMetrics)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsBySchool(Long schoolId) {

        return studentRepository.findBySchoolSchoolId(schoolId)
                .stream()
                .map(this::mapToResponseWithMetrics)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsByClass(Long classId) {

        return studentRepository.findBySchoolClassClassId(classId)
                .stream()
                .map(this::mapToResponseWithMetrics)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsByTeacher(Long teacherId) {
        List<Student> allStds = studentRepository.findAll();
        return allStds.stream()
                .filter(s -> {
                    if (s.getTeacher() != null && teacherId.equals(s.getTeacher().getTeacherId())) return true;
                    if (s.getSchoolClass() != null && s.getSchoolClass().getTeacher() != null && teacherId.equals(s.getSchoolClass().getTeacher().getTeacherId())) return true;
                    return false;
                })
                .map(this::mapToResponseWithMetrics)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDTO updateStudent(Long studentId,
                                            StudentRequestDTO request) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Class not found"));

        student.setUser(user);
        student.setSchool(school);
        student.setSchoolClass(schoolClass);
        student.setRollNumber(request.getRollNumber());
        student.setAdmissionNumber(request.getAdmissionNumber());

        return mapToResponseWithMetrics(studentRepository.save(student));
    }

    @Override
    public void deleteStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        studentRepository.delete(student);
    }
}