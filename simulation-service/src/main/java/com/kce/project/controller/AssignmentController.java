package com.kce.project.controller;

import com.kce.project.dto.request.AssignmentRequestDTO;
import com.kce.project.dto.response.AssignmentResponseDTO;
import com.kce.project.service.AssignmentService;
import com.kce.project.repository.UserRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.ParentRepository;
import com.kce.project.entity.User;
import com.kce.project.entity.Student;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.Parent;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;

    @PostMapping
    public ResponseEntity<AssignmentResponseDTO> createAssignment(
            @Valid @RequestBody AssignmentRequestDTO request) {

        return new ResponseEntity<>(
                assignmentService.createAssignment(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponseDTO>> getAllAssignments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Student: only see their own class assignments
        if (user.getRole() == com.kce.project.enums.Role.STUDENT) {
            Student student = studentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (student != null && student.getSchoolClass() != null) {
                return ResponseEntity.ok(assignmentService.getAssignmentsForStudent(
                    student.getStudentId(), student.getSchoolClass().getClassId()));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Parent: only see child's class assignments
        if (user.getRole() == com.kce.project.enums.Role.PARENT) {
            Parent parent = parentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (parent != null && parent.getStudent() != null && parent.getStudent().getSchoolClass() != null) {
                return ResponseEntity.ok(assignmentService.getAssignmentsByClass(parent.getStudent().getSchoolClass().getClassId()));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Teacher: only see assignments they assigned
        if (user.getRole() == com.kce.project.enums.Role.TEACHER) {
            Teacher teacher = teacherRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (teacher != null) {
                return ResponseEntity.ok(assignmentService.getAssignmentsByTeacher(teacher.getTeacherId()));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/student/me")
    public ResponseEntity<List<AssignmentResponseDTO>> getMyStudentAssignments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Student student = studentRepository.findByUserUserId(user.getUserId()).orElse(null);
        if (student == null || student.getSchoolClass() == null) return ResponseEntity.ok(Collections.emptyList());
        return ResponseEntity.ok(assignmentService.getAssignmentsForStudent(
            student.getStudentId(), student.getSchoolClass().getClassId()));
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
