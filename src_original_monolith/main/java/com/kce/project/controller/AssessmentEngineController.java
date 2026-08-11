package com.kce.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.request.AssessmentSubmissionDTO;
import com.kce.project.dto.response.AssessmentResultResponseDTO;
import com.kce.project.service.AssessmentEngineService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class AssessmentEngineController {

    private final AssessmentEngineService engineService;

    @PostMapping("/assessment/submit")
    public ResponseEntity<AssessmentResultResponseDTO> submitAssessment(
            @RequestBody AssessmentSubmissionDTO request){

        return ResponseEntity.ok(
                engineService.submitAssessment(request));
    }

}
