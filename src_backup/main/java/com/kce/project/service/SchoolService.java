package com.kce.project.service;

import com.kce.project.dto.request.SchoolRequest;
import com.kce.project.dto.response.SchoolResponse;

import java.util.List;

public interface SchoolService {

    SchoolResponse createSchool(SchoolRequest request);

    SchoolResponse getSchoolById(Long schoolId);

    List<SchoolResponse> getAllSchools();

    SchoolResponse updateSchool(Long schoolId, SchoolRequest request);

    void deleteSchool(Long schoolId);
}