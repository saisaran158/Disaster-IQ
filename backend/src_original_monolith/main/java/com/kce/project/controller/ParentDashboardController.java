package com.kce.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kce.project.dto.response.ParentDashboardResponseDTO;
import com.kce.project.service.ParentDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/parent/dashboard")
@RequiredArgsConstructor
public class ParentDashboardController {

    private final ParentDashboardService dashboardService;

    @GetMapping("/{studentId}")
    public ResponseEntity<ParentDashboardResponseDTO> getDashboard(
            @PathVariable Long studentId){

        return ResponseEntity.ok(
                dashboardService.getDashboard(studentId));
    }
}