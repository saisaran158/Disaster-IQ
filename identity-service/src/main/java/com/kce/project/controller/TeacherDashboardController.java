package com.kce.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.response.TeacherDashboardResponseDTO;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.User;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.service.TeacherDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/dashboard")
@RequiredArgsConstructor
public class TeacherDashboardController {

    private final TeacherDashboardService dashboardService;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping("/me")
    public ResponseEntity<TeacherDashboardResponseDTO> getMyDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Teacher teacher = teacherRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        return ResponseEntity.ok(dashboardService.getDashboard(teacher.getTeacherId()));
    }

    @GetMapping("/{teacherId:\\d+}")
    public ResponseEntity<TeacherDashboardResponseDTO> getDashboard(@PathVariable Long teacherId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == com.kce.project.enums.Role.TEACHER) {
            Teacher teacher = teacherRepository.findByUserUserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            if (!teacher.getTeacherId().equals(teacherId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.ok(dashboardService.getDashboard(teacherId));
    }
}
