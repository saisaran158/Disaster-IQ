package com.kce.project.service;

import java.util.List;

import com.kce.project.dto.request.StudentRequestDTO;
import com.kce.project.dto.response.StudentResponseDTO;

public interface StudentService {

    StudentResponseDTO createStudent(StudentRequestDTO request);

    StudentResponseDTO getStudentById(Long studentId);

    List<StudentResponseDTO> getAllStudents();

    List<StudentResponseDTO> getStudentsBySchool(Long schoolId);

    List<StudentResponseDTO> getStudentsByClass(Long classId);

    StudentResponseDTO updateStudent(Long studentId,
                                     StudentRequestDTO request);

    void deleteStudent(Long studentId);
}