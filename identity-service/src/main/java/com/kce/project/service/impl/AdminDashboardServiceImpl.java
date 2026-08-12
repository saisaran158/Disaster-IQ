package com.kce.project.service.impl;

import org.springframework.stereotype.Service;

import com.kce.project.dto.response.AdminDashboardResponseDTO;
import com.kce.project.enums.Role;
import com.kce.project.repository.AssessmentRepository;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.SimulationRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

	private final UserRepository userRepository;

	private final SchoolRepository schoolRepository;

	private final TeacherRepository teacherRepository;

	private final StudentRepository studentRepository;

	private final SchoolClassRepository classRepository;

	private final SimulationRepository simulationRepository;

	private final AssignmentRepository assignmentRepository;

	private final AssessmentRepository assessmentRepository;

    @Override
    public AdminDashboardResponseDTO getDashboard() {

        return AdminDashboardResponseDTO.builder()

                .totalUsers(userRepository.countByActive(true))

                .totalSchools(schoolRepository.count())

                .totalTeachers(userRepository.countByRoleAndActive(Role.TEACHER, true))

                .totalStudents(userRepository.countByRoleAndActive(Role.STUDENT, true))

                .totalParents(userRepository.countByRoleAndActive(Role.PARENT, true))

                .totalCollectors(userRepository.countByRoleAndActive(Role.COLLECTOR, true))

                .totalClasses(classRepository.count())

                .totalSimulations(simulationRepository.count())

                .totalAssignments(assignmentRepository.count())

                .totalAssessments(assessmentRepository.count())

                .build();
    }
}