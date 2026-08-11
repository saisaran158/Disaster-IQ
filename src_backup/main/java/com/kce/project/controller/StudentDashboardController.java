package com.kce.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.response.StudentDashboardResponseDTO;
import com.kce.project.service.StudentDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/dashboard")
@RequiredArgsConstructor
public class StudentDashboardController {

    private final StudentDashboardService dashboardService;

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentDashboardResponseDTO> dashboard(
            @PathVariable Long studentId){

        return ResponseEntity.ok(
                dashboardService.getDashboard(studentId));

    }

}
