package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardResponseDTO {

    private Long studentId;

    private String studentName;

    private int completedAssignments;

    private int completedAssessments;

    private double averageScore;

    private int preparedness;

    private String latestRecommendation;

}