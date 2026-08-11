package com.kce.project.mapper;

import com.kce.project.dto.request.SchoolRequest;
import com.kce.project.dto.response.SchoolResponse;
import com.kce.project.entity.School;
import org.springframework.stereotype.Component;

@Component
public class SchoolMapper {

    public School toEntity(SchoolRequest request) {

        return School.builder()
                .schoolName(request.getSchoolName())
                .district(request.getDistrict())
                .state(request.getState())
                .address(request.getAddress())
                .pincode(request.getPincode())
                .phone(request.getPhone())
                .email(request.getEmail())
                .build();
    }

    public SchoolResponse toResponse(School school) {

        return SchoolResponse.builder()
                .schoolId(school.getSchoolId())
                .schoolName(school.getSchoolName())
                .district(school.getDistrict())
                .state(school.getState())
                .address(school.getAddress())
                .pincode(school.getPincode())
                .phone(school.getPhone())
                .email(school.getEmail())
                .build();
    }

    public void updateEntity(School school, SchoolRequest request) {

        school.setSchoolName(request.getSchoolName());
        school.setDistrict(request.getDistrict());
        school.setState(request.getState());
        school.setAddress(request.getAddress());
        school.setPincode(request.getPincode());
        school.setPhone(request.getPhone());
        school.setEmail(request.getEmail());
    }
}