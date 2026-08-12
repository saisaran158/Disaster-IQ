package com.kce.project.controller;

import com.kce.project.dto.request.StudentRequestDTO;
import com.kce.project.dto.response.StudentResponseDTO;
import com.kce.project.service.StudentService;
import com.kce.project.repository.UserRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.ParentRepository;
import com.kce.project.entity.User;
import com.kce.project.entity.Student;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.Parent;
import com.kce.project.entity.SchoolClass;
import com.kce.project.mapper.StudentMapper;
import com.kce.project.exception.ResourceNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository classRepository;
    private final StudentMapper studentMapper;

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(
            @Valid @RequestBody StudentRequestDTO request) {

        return new ResponseEntity<>(
                studentService.createStudent(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Student role: can only view themselves
        if (user.getRole() == com.kce.project.enums.Role.STUDENT) {
            Student student = studentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (student != null) {
                return ResponseEntity.ok(List.of(studentMapper.toResponse(student)));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Parent role: can only view their child
        if (user.getRole() == com.kce.project.enums.Role.PARENT) {
            Parent parent = parentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (parent != null && parent.getStudent() != null) {
                return ResponseEntity.ok(List.of(studentMapper.toResponse(parent.getStudent())));
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Teacher role: can only view students in their assigned classes
        if (user.getRole() == com.kce.project.enums.Role.TEACHER) {
            Teacher teacher = teacherRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (teacher != null) {
                List<SchoolClass> classes = classRepository.findByTeacherTeacherId(teacher.getTeacherId());
                if (classes != null && !classes.isEmpty()) {
                    List<StudentResponseDTO> teacherStudents = new ArrayList<>();
                    for (SchoolClass c : classes) {
                        teacherStudents.addAll(studentService.getStudentsByClass(c.getClassId()));
                    }
                    return ResponseEntity.ok(teacherStudents);
                }
            }
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(
            @PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getRole() == com.kce.project.enums.Role.STUDENT) {
            Student student = studentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (student == null || !student.getStudentId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else if (user.getRole() == com.kce.project.enums.Role.PARENT) {
            Parent parent = parentRepository.findByUserUserId(user.getUserId()).orElse(null);
            if (parent == null || parent.getStudent() == null || !parent.getStudent().getStudentId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsBySchool(
            @PathVariable Long schoolId) {
        return ResponseEntity.ok(
                studentService.getStudentsBySchool(schoolId));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<StudentResponseDTO>> getStudentsByClass(
            @PathVariable Long classId) {
        return ResponseEntity.ok(
                studentService.getStudentsByClass(classId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDTO request) {
        return ResponseEntity.ok(
                studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Student deleted successfully");
    }
}
