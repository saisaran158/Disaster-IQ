package com.kce.project.service;

import com.kce.project.dto.request.SimulationRequestDTO;
import com.kce.project.dto.response.SimulationResponseDTO;

import java.util.List;

public interface SimulationService {

    SimulationResponseDTO createSimulation(SimulationRequestDTO request);

    SimulationResponseDTO getSimulationById(Long simulationId);

    List<SimulationResponseDTO> getAllSimulations();

    List<SimulationResponseDTO> getSimulationsByTeacher(Long teacherId);

    SimulationResponseDTO updateSimulation(Long simulationId,
                                           SimulationRequestDTO request);

    void deleteSimulation(Long simulationId);
}