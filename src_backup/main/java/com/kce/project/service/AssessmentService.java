package com.kce.project.service;

import com.kce.project.dto.request.AssessmentRequestDTO;
import com.kce.project.dto.response.AssessmentResponseDTO;

import java.util.List;

public interface AssessmentService {

    AssessmentResponseDTO createAssessment(AssessmentRequestDTO request);

    AssessmentResponseDTO getAssessmentById(Long assessmentId);

    List<AssessmentResponseDTO> getAllAssessments();

    AssessmentResponseDTO getAssessmentBySimulation(Long simulationId);

    AssessmentResponseDTO updateAssessment(Long assessmentId,
                                           AssessmentRequestDTO request);

    void deleteAssessment(Long assessmentId);
}