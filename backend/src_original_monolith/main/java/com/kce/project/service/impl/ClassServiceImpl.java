package com.kce.project.service.impl;

import com.kce.project.dto.request.ClassRequestDTO;
import com.kce.project.dto.response.ClassResponseDTO;
import com.kce.project.entity.School;
import com.kce.project.entity.SchoolClass;
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

    @Override
    public ClassResponseDTO createClass(ClassRequestDTO request) {

        School school = schoolRepository.findById(request.getSchoolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        if (classRepository.existsByClassNameAndSectionAndSchool(
                request.getClassName(),
                request.getSection(),
                school)) {

            throw new ResourceAlreadyExistsException(
                    "Class already exists in this school");
        }

        SchoolClass schoolClass = SchoolClass.builder()
                .className(request.getClassName())
                .section(request.getSection())
                .academicYear(request.getAcademicYear())
                .school(school)
                .build();

        return classMapper.toResponse(
                classRepository.save(schoolClass));
    }

    @Override
    public ClassResponseDTO getClassById(Long classId) {

        SchoolClass schoolClass = classRepository.findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Class not found"));

        return classMapper.toResponse(schoolClass);
    }

    @Override
    public List<ClassResponseDTO> getAllClasses() {

        return classRepository.findAll()
                .stream()
                .map(classMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClassResponseDTO> getClassesBySchool(Long schoolId) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found"));

        return classRepository.findBySchool(school)
                .stream()
                .map(classMapper::toResponse)
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

        return classMapper.toResponse(
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