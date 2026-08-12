package com.kce.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.response.ParentDashboardResponseDTO;
import com.kce.project.service.ParentDashboardService;
import com.kce.project.repository.UserRepository;
import com.kce.project.repository.ParentRepository;
import com.kce.project.entity.User;
import com.kce.project.entity.Parent;
import com.kce.project.exception.ResourceNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/parent/dashboard")
@RequiredArgsConstructor
public class ParentDashboardController {

    private final ParentDashboardService dashboardService;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;

    @GetMapping("/me")
    public ResponseEntity<ParentDashboardResponseDTO> getMyDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Parent parent = parentRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        if (parent.getStudent() == null) {
            throw new ResourceNotFoundException("No child linked to this parent yet.");
        }
        return ResponseEntity.ok(dashboardService.getDashboard(parent.getStudent().getStudentId()));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<ParentDashboardResponseDTO> getDashboard(@PathVariable Long studentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == com.kce.project.enums.Role.PARENT) {
            Parent parent = parentRepository.findByUserUserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
            if (parent.getStudent() == null || !parent.getStudent().getStudentId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.ok(dashboardService.getDashboard(studentId));
    }
}
