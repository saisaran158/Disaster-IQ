package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponseDTO {

    private Long studentId;

    private Long userId;

    private String studentName;

    private String email;

    private Long schoolId;

    private String schoolName;

    private Long classId;

    private String className;

    private String section;

    private String rollNumber;

    private String admissionNumber;
}