package com.kce.project.service.impl;

import com.kce.project.dto.request.StudentRequestDTO;
import com.kce.project.dto.response.StudentResponseDTO;
import com.kce.project.entity.School;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Student;
import com.kce.project.entity.User;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.enums.SimulationStatus;
import com.kce.project.mapper.StudentMapper;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.service.StudentService;
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
                    .filter(r -> r.getPercentage() != null && r.getPercentage() > 0)
                    .mapToDouble(AssessmentResult::getPercentage)
                    .average()
                    .orElse(0.0);
            }
            dto.setAverageScore(Math.round(avg));
        } catch (Exception e) {
            dto.setAverageScore(0.0);
        }

        // 2. Calculate Completion Rate
        try {
            long totalAssignments = 0;
            long completedAssignments = 0;
            if (student.getSchoolClass() != null) {
                totalAssignments = assignmentRepository.countBySchoolClassClassId(student.getSchoolClass().getClassId());
            }
            completedAssignments = studentProgressRepository.countByStudentStudentIdAndStatus(student.getStudentId(), SimulationStatus.COMPLETED);
            dto.setCompletionRate(completedAssignments + "/" + totalAssignments);
        } catch (Exception e) {
            dto.setCompletionRate("0/0");
        }

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