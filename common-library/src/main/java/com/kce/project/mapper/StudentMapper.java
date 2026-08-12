package com.kce.project.mapper;

import com.kce.project.dto.response.StudentResponseDTO;
import com.kce.project.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponseDTO toResponse(Student student) {

        return StudentResponseDTO.builder()
                .studentId(student.getStudentId())
                .userId(student.getUser().getUserId())
                .studentName(student.getUser().getFullName())
                .email(student.getUser().getEmail())
                .schoolId(student.getSchool().getSchoolId())
                .schoolName(student.getSchool().getSchoolName())
                .classId(student.getSchoolClass().getClassId())
                .className(student.getSchoolClass().getClassName())
                .section(student.getSchoolClass().getSection())
                .rollNumber(student.getRollNumber())
                .admissionNumber(student.getAdmissionNumber())
                .password(student.getUser().getPlainPassword())
                .build();
    }
}