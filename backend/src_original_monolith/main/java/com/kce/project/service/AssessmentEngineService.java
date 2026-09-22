package com.kce.project.service;

import com.kce.project.dto.request.AssessmentSubmissionDTO;
import com.kce.project.dto.response.AssessmentResultResponseDTO;

public interface AssessmentEngineService {

    AssessmentResultResponseDTO submitAssessment(
            AssessmentSubmissionDTO request);

}