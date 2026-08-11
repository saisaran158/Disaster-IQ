package com.kce.project.dto.request;

import com.kce.project.enums.AssignmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentRequestDTO {

    @NotNull(message = "Simulation ID is required")
    private Long simulationId;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Teacher ID is required")
    private Long teacherId;

    @NotNull(message = "Assigned Date is required")
    private LocalDate assignedDate;

    @NotNull(message = "Due Date is required")
    private LocalDate dueDate;

    @NotNull(message = "Status is required")
    private AssignmentStatus status;

    private String instructions;
}