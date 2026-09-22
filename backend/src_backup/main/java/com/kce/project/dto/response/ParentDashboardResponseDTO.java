package com.kce.project.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentDashboardResponseDTO {

    private Long studentId;

    private String studentName;

    private String className;

    private String schoolName;

    private int completedAssignments;

    private int completedAssessments;

    private double averageScore;

    private String latestRecommendation;

}