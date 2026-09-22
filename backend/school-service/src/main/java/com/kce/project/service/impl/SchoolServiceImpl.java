package com.kce.project.service.impl;

import com.kce.project.dto.request.SchoolRequest;
import com.kce.project.dto.response.SchoolResponse;
import com.kce.project.entity.School;
import com.kce.project.mapper.SchoolMapper;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.entity.Student;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.service.SchoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.exception.ResourceAlreadyExistsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AssessmentResultRepository assessmentResultRepository;

    private SchoolResponse mapToSchoolResponseWithMetrics(School school) {
        SchoolResponse response = schoolMapper.toResponse(school);
        try {
            int studentsCount = studentRepository.findBySchoolSchoolId(school.getSchoolId()).size();
            response.setStudentsCount(studentsCount);
        } catch (Exception e) {
            response.setStudentsCount(0);
        }

        try {
            int teachersCount = teacherRepository.findBySchoolSchoolId(school.getSchoolId()).size();
            response.setTeachersCount(teachersCount);
        } catch (Exception e) {
            response.setTeachersCount(0);
        }

        try {
            List<Student> students = studentRepository.findBySchoolSchoolId(school.getSchoolId());
            List<Double> studentAverages = new java.util.ArrayList<>();
            for (Student student : students) {
                List<AssessmentResult> studentResults = assessmentResultRepository.findByStudentStudentId(student.getStudentId());
                if (studentResults != null && !studentResults.isEmpty()) {
                    double studentAvg = studentResults.stream()
                        .filter(r -> r.getPercentage() != null)
                        .mapToDouble(AssessmentResult::getPercentage)
                        .average()
                        .orElse(-1.0);
                    if (studentAvg >= 0) {
                        studentAverages.add(studentAvg);
                    }
                }
            }
            double schoolAvg = 0.0;
            if (!studentAverages.isEmpty()) {
                schoolAvg = studentAverages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            }
            response.setAverageScore(Math.round(schoolAvg));
        } catch (Exception e) {
            response.setAverageScore(0.0);
        }
        return response;
    }

    @Override
    public SchoolResponse createSchool(SchoolRequest request) {

        if (schoolRepository.existsBySchoolName(request.getSchoolName())) {
            throw new ResourceAlreadyExistsException("School already exists.");
        }

        if (request.getEmail() != null &&
                schoolRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists.");
        }

        School school = schoolMapper.toEntity(request);

        School savedSchool = schoolRepository.save(school);

        return mapToSchoolResponseWithMetrics(savedSchool);
    }

    @Override
    public SchoolResponse getSchoolById(Long schoolId) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found."));

        return mapToSchoolResponseWithMetrics(school);
    }

    @Override
    public List<SchoolResponse> getAllSchools() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
                String email = authentication.getName();
                java.util.Optional<com.kce.project.entity.User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    com.kce.project.entity.User user = userOpt.get();
                    if (user.getRole() == com.kce.project.enums.Role.COLLECTOR && user.getDistrict() != null) {
                        return schoolRepository.findByDistrictIgnoreCase(user.getDistrict())
                                .stream()
                                .map(this::mapToSchoolResponseWithMetrics)
                                .collect(Collectors.toList());
                    }
                }
            }
        } catch (Exception e) {
            // fallback
        }

        return schoolRepository.findAll()
                .stream()
                .map(this::mapToSchoolResponseWithMetrics)
                .collect(Collectors.toList());
    }

    @Override
    public SchoolResponse updateSchool(Long schoolId,
                                       SchoolRequest request) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found."));

        schoolMapper.updateEntity(school, request);

        School updatedSchool = schoolRepository.save(school);

        return mapToSchoolResponseWithMetrics(updatedSchool);
    }

    @Override
    public void deleteSchool(Long schoolId) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found."));

        schoolRepository.delete(school);
    }
}