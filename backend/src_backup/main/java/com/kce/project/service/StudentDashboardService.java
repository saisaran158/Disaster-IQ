package com.kce.project.service;

import com.kce.project.dto.response.StudentDashboardResponseDTO;

public interface StudentDashboardService {

    StudentDashboardResponseDTO getDashboard(Long studentId);

}