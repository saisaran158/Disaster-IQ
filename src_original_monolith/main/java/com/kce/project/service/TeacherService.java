package com.kce.project.service;

import com.kce.project.dto.request.TeacherRequestDTO;
import com.kce.project.dto.response.TeacherResponseDTO;

import java.util.List;

public interface TeacherService {

    TeacherResponseDTO createTeacher(TeacherRequestDTO request);

    TeacherResponseDTO getTeacherById(Long teacherId);

    List<TeacherResponseDTO> getAllTeachers();

    List<TeacherResponseDTO> getTeachersBySchool(Long schoolId);

    TeacherResponseDTO updateTeacher(Long teacherId,
                                     TeacherRequestDTO request);

    void deleteTeacher(Long teacherId);
}