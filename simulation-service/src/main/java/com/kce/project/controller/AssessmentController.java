package com.kce.project.controller;

import com.kce.project.dto.request.AssessmentRequestDTO;
import com.kce.project.dto.response.AssessmentResponseDTO;
import com.kce.project.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<AssessmentResponseDTO> createAssessment(
            @Valid @RequestBody AssessmentRequestDTO request) {

        return new ResponseEntity<>(
                assessmentService.createAssessment(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponseDTO>> getAllAssessments() {

        return ResponseEntity.ok(
                assessmentService.getAllAssessments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResponseDTO> getAssessmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assessmentService.getAssessmentById(id));
    }

    @GetMapping("/simulation/{simulationId}")
    public ResponseEntity<AssessmentResponseDTO> getAssessmentBySimulation(
            @PathVariable Long simulationId) {

        return ResponseEntity.ok(
                assessmentService.getAssessmentBySimulation(simulationId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssessmentResponseDTO> updateAssessment(
            @PathVariable Long id,
            @Valid @RequestBody AssessmentRequestDTO request) {

        return ResponseEntity.ok(
                assessmentService.updateAssessment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssessment(
            @PathVariable Long id) {

        assessmentService.deleteAssessment(id);

        return ResponseEntity.ok("Assessment deleted successfully");
    }
}