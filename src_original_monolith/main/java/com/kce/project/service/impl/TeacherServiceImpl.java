package com.kce.project.service.impl;

import com.kce.project.dto.request.TeacherRequestDTO;
import com.kce.project.dto.response.TeacherResponseDTO;
import com.kce.project.entity.School;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.User;
import com.kce.project.mapper.TeacherMapper;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.service.TeacherService;
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
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final TeacherMapper teacherMapper;

    @Override
    public TeacherResponseDTO createTeacher(TeacherRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        if (teacherRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new ResourceAlreadyExistsException("Employee ID already exists");
        }

        if (teacherRepository.existsByUser(user)) {
            throw new ResourceAlreadyExistsException("Teacher already exists for this user");
        }

        Teacher teacher = Teacher.builder()
                .user(user)
                .school(school)
                .employeeId(request.getEmployeeId())
                .qualification(request.getQualification())
                .specialization(request.getSpecialization())
                .build();

        return teacherMapper.toResponse(
                teacherRepository.save(teacher));
    }

    @Override
    public TeacherResponseDTO getTeacherById(Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found"));

        return teacherMapper.toResponse(teacher);
    }

    @Override
    public List<TeacherResponseDTO> getAllTeachers() {

        return teacherRepository.findAll()
                .stream()
                .map(teacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherResponseDTO> getTeachersBySchool(Long schoolId) {

        return teacherRepository.findBySchoolSchoolId(schoolId)
                .stream()
                .map(teacherMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherResponseDTO updateTeacher(Long teacherId,
                                            TeacherRequestDTO request) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        teacher.setUser(user);
        teacher.setSchool(school);
        teacher.setEmployeeId(request.getEmployeeId());
        teacher.setQualification(request.getQualification());
        teacher.setSpecialization(request.getSpecialization());

        return teacherMapper.toResponse(
                teacherRepository.save(teacher));
    }

    @Override
    public void deleteTeacher(Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Teacher not found"));

        teacherRepository.delete(teacher);
    }
}