package com.kce.project.controller;

import com.kce.project.dto.request.SchoolRequest;
import com.kce.project.dto.response.SchoolResponse;
import com.kce.project.service.SchoolService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    @PostMapping
    public ResponseEntity<SchoolResponse> createSchool(
            @Valid @RequestBody SchoolRequest request) {

        return new ResponseEntity<>(
                schoolService.createSchool(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolResponse> getSchoolById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                schoolService.getSchoolById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<SchoolResponse>> getAllSchools() {

        return ResponseEntity.ok(
                schoolService.getAllSchools()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolResponse> updateSchool(
            @PathVariable Long id,
            @Valid @RequestBody SchoolRequest request) {

        return ResponseEntity.ok(
                schoolService.updateSchool(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchool(
            @PathVariable Long id) {

        schoolService.deleteSchool(id);

        return ResponseEntity.ok("School deleted successfully.");
    }
}