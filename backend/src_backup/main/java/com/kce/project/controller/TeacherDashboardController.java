package com.kce.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.response.TeacherDashboardResponseDTO;
import com.kce.project.service.TeacherDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/dashboard")
@RequiredArgsConstructor
public class TeacherDashboardController {

	private final TeacherDashboardService dashboardService;

	@GetMapping("/{teacherId}")
	public ResponseEntity<TeacherDashboardResponseDTO> getDashboard(@PathVariable Long teacherId) {

		return ResponseEntity.ok(dashboardService.getDashboard(teacherId));

	}

}
