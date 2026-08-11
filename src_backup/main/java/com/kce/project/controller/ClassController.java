package com.kce.project.controller;

import com.kce.project.dto.request.ClassRequestDTO;
import com.kce.project.dto.response.ClassResponseDTO;
import com.kce.project.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @PostMapping
    public ResponseEntity<ClassResponseDTO> createClass(
            @Valid @RequestBody ClassRequestDTO request) {

        return new ResponseEntity<>(
                classService.createClass(request),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassResponseDTO> getClassById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                classService.getClassById(id));
    }

    @GetMapping
    public ResponseEntity<List<ClassResponseDTO>> getAllClasses() {

        return ResponseEntity.ok(
                classService.getAllClasses());
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<ClassResponseDTO>> getClassesBySchool(
            @PathVariable Long schoolId) {

        return ResponseEntity.ok(
                classService.getClassesBySchool(schoolId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassResponseDTO> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody ClassRequestDTO request) {

        return ResponseEntity.ok(
                classService.updateClass(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClass(
            @PathVariable Long id) {

        classService.deleteClass(id);

        return ResponseEntity.ok(
                "Class deleted successfully");
    }
}