package com.kce.project.mapper;

import com.kce.project.dto.response.StudentResponseDTO;
import com.kce.project.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponseDTO toResponse(Student student) {
        if (student == null) return null;

        return StudentResponseDTO.builder()
                .studentId(student.getStudentId())
                .userId(student.getUser() != null ? student.getUser().getUserId() : null)
                .studentName(student.getUser() != null ? student.getUser().getFullName() : null)
                .email(student.getUser() != null ? student.getUser().getEmail() : null)
                .schoolId(student.getSchool() != null ? student.getSchool().getSchoolId() : null)
                .schoolName(student.getSchool() != null ? student.getSchool().getSchoolName() : null)
                .classId(student.getSchoolClass() != null ? student.getSchoolClass().getClassId() : null)
                .className(student.getSchoolClass() != null ? student.getSchoolClass().getClassName() : null)
                .section(student.getSchoolClass() != null ? student.getSchoolClass().getSection() : null)
                .rollNumber(student.getRollNumber())
                .admissionNumber(student.getAdmissionNumber())
                .password(student.getUser() != null ? student.getUser().getPlainPassword() : null)
                .build();
    }
}