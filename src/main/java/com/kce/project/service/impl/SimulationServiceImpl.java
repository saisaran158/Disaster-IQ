package com.kce.project.service.impl;

import com.kce.project.dto.request.SimulationRequestDTO;
import com.kce.project.dto.response.SimulationResponseDTO;
import com.kce.project.entity.Simulation;
import com.kce.project.entity.Teacher;
import com.kce.project.mapper.SimulationMapper;
import com.kce.project.repository.SimulationRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimulationServiceImpl implements SimulationService {

    private final SimulationRepository simulationRepository;
    private final TeacherRepository teacherRepository;
    private final SimulationMapper simulationMapper;

    @Override
    public SimulationResponseDTO createSimulation(SimulationRequestDTO request) {

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        Simulation simulation = Simulation.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .disasterType(request.getDisasterType())
                .difficulty(request.getDifficulty())
                .duration(request.getDuration())
                .thumbnail(request.getThumbnail())
                .active(request.getActive() == null ? true : request.getActive())
                .createdBy(teacher)
                .build();

        return simulationMapper.toResponse(
                simulationRepository.save(simulation));
    }

    @Override
    public SimulationResponseDTO getSimulationById(Long simulationId) {

        Simulation simulation = simulationRepository.findById(simulationId)
                .orElseThrow(() ->
                        new RuntimeException("Simulation not found"));

        return simulationMapper.toResponse(simulation);
    }

    @Override
    public List<SimulationResponseDTO> getAllSimulations() {

        return simulationRepository.findAll()
                .stream()
                .map(simulationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SimulationResponseDTO> getSimulationsByTeacher(Long teacherId) {

        return simulationRepository.findByCreatedByTeacherId(teacherId)
                .stream()
                .map(simulationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SimulationResponseDTO updateSimulation(Long simulationId,
                                                  SimulationRequestDTO request) {

        Simulation simulation = simulationRepository.findById(simulationId)
                .orElseThrow(() ->
                        new RuntimeException("Simulation not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() ->
                        new RuntimeException("Teacher not found"));

        simulation.setTitle(request.getTitle());
        simulation.setDescription(request.getDescription());
        simulation.setDisasterType(request.getDisasterType());
        simulation.setDifficulty(request.getDifficulty());
        simulation.setDuration(request.getDuration());
        simulation.setThumbnail(request.getThumbnail());
        simulation.setActive(request.getActive());
        simulation.setCreatedBy(teacher);

        return simulationMapper.toResponse(
                simulationRepository.save(simulation));
    }

    @Override
    public void deleteSimulation(Long simulationId) {

        Simulation simulation = simulationRepository.findById(simulationId)
                .orElseThrow(() ->
                        new RuntimeException("Simulation not found"));

        simulationRepository.delete(simulation);
    }
}