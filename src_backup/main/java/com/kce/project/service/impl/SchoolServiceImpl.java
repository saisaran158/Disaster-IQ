package com.kce.project.service.impl;

import com.kce.project.dto.request.SchoolRequest;
import com.kce.project.dto.response.SchoolResponse;
import com.kce.project.entity.School;
import com.kce.project.mapper.SchoolMapper;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.service.SchoolService;
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
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;

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

        return schoolMapper.toResponse(savedSchool);
    }

    @Override
    public SchoolResponse getSchoolById(Long schoolId) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found."));

        return schoolMapper.toResponse(school);
    }

    @Override
    public List<SchoolResponse> getAllSchools() {

        return schoolRepository.findAll()
                .stream()
                .map(schoolMapper::toResponse)
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

        return schoolMapper.toResponse(updatedSchool);
    }

    @Override
    public void deleteSchool(Long schoolId) {

        School school = schoolRepository.findById(schoolId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("School not found."));

        schoolRepository.delete(school);
    }
}