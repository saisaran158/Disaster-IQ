package com.kce.project.mapper;

import com.kce.project.dto.response.AssignmentResponseDTO;
import com.kce.project.entity.Assignment;
import org.springframework.stereotype.Component;

@Component
public class AssignmentMapper {

    public AssignmentResponseDTO toResponse(Assignment assignment) {

        return AssignmentResponseDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .simulationId(assignment.getSimulation().getSimulationId())
                .classId(assignment.getSchoolClass().getClassId())
                .className(assignment.getSchoolClass().getClassName())
                .teacherId(assignment.getTeacher().getTeacherId())
                .teacherName(assignment.getTeacher().getUser().getFullName())
                .assignedDate(assignment.getAssignedDate())
                .dueDate(assignment.getDueDate())
                .status(assignment.getStatus())
                .instructions(assignment.getInstructions())
                .build();
    }
}