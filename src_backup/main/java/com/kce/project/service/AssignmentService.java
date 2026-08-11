package com.kce.project.service;

import com.kce.project.dto.request.AssignmentRequestDTO;
import com.kce.project.dto.response.AssignmentResponseDTO;

import java.util.List;

public interface AssignmentService {

    AssignmentResponseDTO createAssignment(AssignmentRequestDTO request);

    AssignmentResponseDTO getAssignmentById(Long assignmentId);

    List<AssignmentResponseDTO> getAllAssignments();

    List<AssignmentResponseDTO> getAssignmentsByTeacher(Long teacherId);

    List<AssignmentResponseDTO> getAssignmentsByClass(Long classId);

    AssignmentResponseDTO updateAssignment(Long assignmentId,
                                           AssignmentRequestDTO request);

    void deleteAssignment(Long assignmentId);
}