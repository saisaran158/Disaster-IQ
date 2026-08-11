package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponseDTO {

    private Long teacherId;

    private Long userId;

    private String teacherName;

    private String email;

    private String employeeId;

    private String qualification;

    private String specialization;

    private Long schoolId;

    private String schoolName;
}