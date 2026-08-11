package com.kce.project.dto.response;

import com.kce.project.enums.AssignmentStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentResponseDTO {

    private Long assignmentId;

    private Long simulationId;

    private Long classId;

    private String className;

    private Long teacherId;

    private String teacherName;

    private LocalDate assignedDate;

    private LocalDate dueDate;

    private AssignmentStatus status;

    private String instructions;
}