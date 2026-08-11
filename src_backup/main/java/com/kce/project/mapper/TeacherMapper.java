package com.kce.project.mapper;

import com.kce.project.dto.response.TeacherResponseDTO;
import com.kce.project.entity.Teacher;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {

    public TeacherResponseDTO toResponse(Teacher teacher) {

        return TeacherResponseDTO.builder()
                .teacherId(teacher.getTeacherId())
                .userId(teacher.getUser().getUserId())
                .teacherName(teacher.getUser().getFullName())
                .email(teacher.getUser().getEmail())
                .employeeId(teacher.getEmployeeId())
                .qualification(teacher.getQualification())
                .specialization(teacher.getSpecialization())
                .schoolId(teacher.getSchool().getSchoolId())
                .schoolName(teacher.getSchool().getSchoolName())
                .build();
    }
}