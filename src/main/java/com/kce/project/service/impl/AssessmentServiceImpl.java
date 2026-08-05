package com.kce.project.service.impl;

import com.kce.project.dto.request.AssessmentRequestDTO;
import com.kce.project.dto.response.AssessmentResponseDTO;
import com.kce.project.entity.Assessment;
import com.kce.project.entity.Simulation;
import com.kce.project.mapper.AssessmentMapper;
import com.kce.project.repository.AssessmentRepository;
import com.kce.project.repository.SimulationRepository;
import com.kce.project.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final SimulationRepository simulationRepository;
    private final AssessmentMapper assessmentMapper;

    @Override
    public AssessmentResponseDTO createAssessment(AssessmentRequestDTO request) {

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new RuntimeException("Simulation not found"));

        Assessment assessment = Assessment.builder()
                .title(request.getTitle())
                .totalMarks(request.getTotalMarks())
                .passingMarks(request.getPassingMarks())
                .duration(request.getDuration())
                .simulation(simulation)
                .build();

        return assessmentMapper.toResponse(
                assessmentRepository.save(assessment));
    }

    @Override
    public AssessmentResponseDTO getAssessmentById(Long assessmentId) {

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        return assessmentMapper.toResponse(assessment);
    }

    @Override
    public List<AssessmentResponseDTO> getAllAssessments() {

        return assessmentRepository.findAll()
                .stream()
                .map(assessmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AssessmentResponseDTO getAssessmentBySimulation(Long simulationId) {

        Assessment assessment = assessmentRepository
                .findBySimulationSimulationId(simulationId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found"));

        return assessmentMapper.toResponse(assessment);
    }

    @Override
    public AssessmentResponseDTO updateAssessment(Long assessmentId,
                                                  AssessmentRequestDTO request) {

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found"));

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() ->
                        new RuntimeException("Simulation not found"));

        assessment.setTitle(request.getTitle());
        assessment.setTotalMarks(request.getTotalMarks());
        assessment.setPassingMarks(request.getPassingMarks());
        assessment.setDuration(request.getDuration());
        assessment.setSimulation(simulation);

        return assessmentMapper.toResponse(
                assessmentRepository.save(assessment));
    }

    @Override
    public void deleteAssessment(Long assessmentId) {

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found"));

        assessmentRepository.delete(assessment);
    }
}