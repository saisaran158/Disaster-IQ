package com.kce.project.service;

import com.kce.project.dto.response.ParentDashboardResponseDTO;

public interface ParentDashboardService {

    ParentDashboardResponseDTO getDashboard(Long studentId);

}