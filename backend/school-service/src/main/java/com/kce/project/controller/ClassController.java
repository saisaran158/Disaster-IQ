package com.kce.project.controller;

import com.kce.project.dto.request.ClassRequestDTO;
import com.kce.project.dto.response.ClassResponseDTO;
import com.kce.project.service.ClassService;
import com.kce.project.repository.UserRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.ParentRepository;
import com.kce.project.entity.User;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.Student;
import com.kce.project.entity.Parent;
import com.kce.project.mapper.ClassMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ClassMapper classMapper;

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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Student: only see their own class
        if (user.getRole() == com.kce.project.enums.Role.STUDENT) {
            Student student = studentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (student != null && student.getSchoolClass() != null) {
                return ResponseEntity.ok(List.of(classMapper.toResponse(student.getSchoolClass())));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Parent: only see child's class
        if (user.getRole() == com.kce.project.enums.Role.PARENT) {
            Parent parent = parentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (parent != null && parent.getStudent() != null && parent.getStudent().getSchoolClass() != null) {
                return ResponseEntity.ok(List.of(classMapper.toResponse(parent.getStudent().getSchoolClass())));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Teacher: only see classes they teach
        if (user.getRole() == com.kce.project.enums.Role.TEACHER) {
            Teacher teacher = teacherRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (teacher != null) {
                return ResponseEntity.ok(classService.getClassesByTeacher(teacher.getTeacherId()));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(classService.getAllClasses());
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
        return ResponseEntity.ok("Class deleted successfully");
    }
}
