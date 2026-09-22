package com.kce.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.response.StudentDashboardResponseDTO;
import com.kce.project.entity.Student;
import com.kce.project.entity.User;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.service.StudentDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/dashboard")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final StudentDashboardService dashboardService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/me")
    public ResponseEntity<StudentDashboardResponseDTO> getMyDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return ResponseEntity.ok(dashboardService.getDashboard(student.getStudentId()));
    }

    @GetMapping("/{studentId:\\d+}")
    public ResponseEntity<StudentDashboardResponseDTO> dashboard(
            @PathVariable Long studentId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == com.kce.project.enums.Role.STUDENT) {
            Student student = studentRepository.findByUserUserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            if (!student.getStudentId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.ok(dashboardService.getDashboard(studentId));
    }
}
