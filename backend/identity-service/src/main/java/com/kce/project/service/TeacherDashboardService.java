package com.kce.project.service;

import com.kce.project.dto.response.TeacherDashboardResponseDTO;

public interface TeacherDashboardService {

    TeacherDashboardResponseDTO getDashboard(Long teacherId);

}