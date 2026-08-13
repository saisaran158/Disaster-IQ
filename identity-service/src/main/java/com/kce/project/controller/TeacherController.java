package com.kce.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.request.TeacherRequestDTO;
import com.kce.project.dto.response.TeacherResponseDTO;
import com.kce.project.service.TeacherService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    public ResponseEntity<TeacherResponseDTO> createTeacher(
            @Valid @RequestBody TeacherRequestDTO request) {

        return new ResponseEntity<>(
                teacherService.createTeacher(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TeacherResponseDTO>> getAllTeachers() {

        return ResponseEntity.ok(
                teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> getTeacherById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                teacherService.getTeacherById(id));
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<TeacherResponseDTO>> getTeachersBySchool(
            @PathVariable Long schoolId) {

        return ResponseEntity.ok(
                teacherService.getTeachersBySchool(schoolId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherResponseDTO> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequestDTO request) {

        return ResponseEntity.ok(
                teacherService.updateTeacher(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTeacher(
            @PathVariable Long id) {

        teacherService.deleteTeacher(id);

        return ResponseEntity.ok("Teacher deleted successfully");
    }
}