package com.kce.project.controller;

import com.kce.project.dto.request.AssignmentRequestDTO;
import com.kce.project.dto.response.AssignmentResponseDTO;
import com.kce.project.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<AssignmentResponseDTO> createAssignment(
            @Valid @RequestBody AssignmentRequestDTO request) {

        return new ResponseEntity<>(
                assignmentService.createAssignment(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponseDTO>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponseDTO> getAssignmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignmentsByTeacher(
            @PathVariable Long teacherId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByTeacher(teacherId));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AssignmentResponseDTO>> getAssignmentsByClass(
            @PathVariable Long classId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByClass(classId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponseDTO> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequestDTO request) {

        return ResponseEntity.ok(
                assignmentService.updateAssignment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssignment(
            @PathVariable Long id) {

        assignmentService.deleteAssignment(id);

        return ResponseEntity.ok("Assignment deleted successfully");
    }
}