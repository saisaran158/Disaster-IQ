package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassResponseDTO {

    private Long classId;

    private String className;

    private String section;

    private String academicYear;

    private Long schoolId;

    private String schoolName;
}