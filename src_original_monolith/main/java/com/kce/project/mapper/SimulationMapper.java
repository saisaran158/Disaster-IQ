package com.kce.project.mapper;

import com.kce.project.dto.response.SimulationResponseDTO;
import com.kce.project.entity.Simulation;
import org.springframework.stereotype.Component;

@Component
public class SimulationMapper {

    public SimulationResponseDTO toResponse(Simulation simulation) {

        return SimulationResponseDTO.builder()
                .simulationId(simulation.getSimulationId())
                .title(simulation.getTitle())
                .description(simulation.getDescription())
                .disasterType(simulation.getDisasterType())
                .difficulty(simulation.getDifficulty())
                .duration(simulation.getDuration())
                .thumbnail(simulation.getThumbnail())
                .active(simulation.getActive())
                .teacherId(simulation.getCreatedBy().getTeacherId())
                .teacherName(simulation.getCreatedBy().getUser().getFullName())
                .build();
    }
}