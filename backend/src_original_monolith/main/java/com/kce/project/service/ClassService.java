package com.kce.project.service;

import com.kce.project.dto.request.ClassRequestDTO;
import com.kce.project.dto.response.ClassResponseDTO;

import java.util.List;

public interface ClassService {

    ClassResponseDTO createClass(ClassRequestDTO request);

    ClassResponseDTO getClassById(Long classId);

    List<ClassResponseDTO> getAllClasses();

    List<ClassResponseDTO> getClassesBySchool(Long schoolId);

    ClassResponseDTO updateClass(Long classId, ClassRequestDTO request);

    void deleteClass(Long classId);
}