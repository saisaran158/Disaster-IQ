package com.kce.project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherDashboardResponseDTO {

    private Long teacherId;

    private String teacherName;

    private int totalClasses;

    private int totalStudents;

    private int totalAssignments;

    private int totalSimulations;

    private int totalAssessments;

    private double averageScore;

    private int passedStudents;

    private int failedStudents;

}