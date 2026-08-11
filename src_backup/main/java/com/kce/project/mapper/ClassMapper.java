package com.kce.project.mapper;

import com.kce.project.dto.response.ClassResponseDTO;
import com.kce.project.entity.SchoolClass;
import org.springframework.stereotype.Component;

@Component
public class ClassMapper {

    public ClassResponseDTO toResponse(SchoolClass schoolClass) {

        return ClassResponseDTO.builder()
                .classId(schoolClass.getClassId())
                .className(schoolClass.getClassName())
                .section(schoolClass.getSection())
                .academicYear(schoolClass.getAcademicYear())
                .schoolId(schoolClass.getSchool().getSchoolId())
                .schoolName(schoolClass.getSchool().getSchoolName())
                .build();
    }
}