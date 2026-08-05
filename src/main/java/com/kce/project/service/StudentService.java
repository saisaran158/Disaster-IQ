package com.kce.project.service;

import com.kce.project.dto.request.StudentRequestDTO;
import com.kce.project.dto.response.StudentResponseDTO;

import java.util.List;

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