package com.kce.project.service.impl;

import com.kce.project.dto.request.StudentRequestDTO;
import com.kce.project.dto.response.StudentResponseDTO;
import com.kce.project.entity.School;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Student;
import com.kce.project.entity.User;
import com.kce.project.mapper.StudentMapper;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.UserRepository;
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

        return studentMapper.toResponse(studentRepository.save(student));
    }

    @Override
    public StudentResponseDTO getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        return studentMapper.toResponse(student);
    }

    @Override
    public List<StudentResponseDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsBySchool(Long schoolId) {

        return studentRepository.findBySchoolSchoolId(schoolId)
                .stream()
                .map(studentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentResponseDTO> getStudentsByClass(Long classId) {

        return studentRepository.findBySchoolClassClassId(classId)
                .stream()
                .map(studentMapper::toResponse)
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

        return studentMapper.toResponse(studentRepository.save(student));
    }

    @Override
    public void deleteStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        studentRepository.delete(student);
    }
}