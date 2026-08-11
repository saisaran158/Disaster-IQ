package com.kce.project.mapper;

import com.kce.project.dto.response.AssessmentResponseDTO;
import com.kce.project.entity.Assessment;
import org.springframework.stereotype.Component;

@Component
public class AssessmentMapper {

    public AssessmentResponseDTO toResponse(Assessment assessment) {

        return AssessmentResponseDTO.builder()
                .assessmentId(assessment.getAssessmentId())
                .title(assessment.getTitle())
                .totalMarks(assessment.getTotalMarks())
                .passingMarks(assessment.getPassingMarks())
                .duration(assessment.getDuration())
                .simulationId(assessment.getSimulation().getSimulationId())
                .simulationTitle(assessment.getSimulation().getTitle())
                .build();
    }
}