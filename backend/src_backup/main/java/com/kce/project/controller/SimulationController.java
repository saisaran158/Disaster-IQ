package com.kce.project.controller;

import com.kce.project.dto.request.SimulationRequestDTO;
import com.kce.project.dto.response.SimulationResponseDTO;
import com.kce.project.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulations")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @PostMapping
    public ResponseEntity<SimulationResponseDTO> createSimulation(
            @Valid @RequestBody SimulationRequestDTO request) {

        return new ResponseEntity<>(
                simulationService.createSimulation(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SimulationResponseDTO>> getAllSimulations() {
        return ResponseEntity.ok(
                simulationService.getAllSimulations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SimulationResponseDTO> getSimulationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                simulationService.getSimulationById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<SimulationResponseDTO>> getTeacherSimulations(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(
                simulationService.getSimulationsByTeacher(teacherId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SimulationResponseDTO> updateSimulation(
            @PathVariable Long id,
            @Valid @RequestBody SimulationRequestDTO request) {

        return ResponseEntity.ok(
                simulationService.updateSimulation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSimulation(
            @PathVariable Long id) {

        simulationService.deleteSimulation(id);

        return ResponseEntity.ok("Simulation deleted successfully");
    }
}