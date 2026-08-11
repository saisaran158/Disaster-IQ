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
public class AdminDashboardResponseDTO {

    private long totalUsers;

    private long totalSchools;

    private long totalTeachers;

    private long totalStudents;

    private long totalParents;

    private long totalCollectors;

    private long totalClasses;

    private long totalSimulations;

    private long totalAssignments;

    private long totalAssessments;
}