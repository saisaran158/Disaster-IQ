package com.kce.project.controller;

import com.kce.project.entity.User;
import com.kce.project.enums.Role;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.repository.ParentRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher/parents")
@RequiredArgsConstructor
public class TeacherParentApprovalController {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping("/pending")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getPendingParents() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        User teacherUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher user not found"));
        com.kce.project.entity.Teacher teacher = teacherRepository.findByUserUserId(teacherUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher details not found"));

        List<User> pendingUsers = userRepository.findByRoleAndActiveFetchSchool(Role.PARENT, false);
        List<Map<String, Object>> response = pendingUsers.stream()
                .filter(user -> {
                    var parentOpt = parentRepository.findByUserUserId(user.getUserId());
                    if (parentOpt.isPresent()) {
                        var student = parentOpt.get().getStudent();
                        if (student != null && student.getSchoolClass() != null && student.getSchoolClass().getTeacher() != null) {
                            return student.getSchoolClass().getTeacher().getTeacherId().equals(teacher.getTeacherId());
                        }
                    }
                    return false;
                })
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("userId", user.getUserId());
                    map.put("fullName", user.getFullName());
                    map.put("email", user.getEmail());
                    map.put("phone", user.getPhone());
                    map.put("schoolName", user.getSchool() != null ? user.getSchool().getSchoolName() : "Green Valley High School");
                    map.put("status", "PENDING_APPROVAL");
                    return map;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/approve")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Map<String, String>> approveParent(@PathVariable Long userId) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        User teacherUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher user not found"));
        com.kce.project.entity.Teacher teacher = teacherRepository.findByUserUserId(teacherUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher details not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        com.kce.project.entity.Parent parent = parentRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        var student = parent.getStudent();
        if (student == null || student.getSchoolClass() == null || student.getSchoolClass().getTeacher() == null ||
                !student.getSchoolClass().getTeacher().getTeacherId().equals(teacher.getTeacherId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        user.setActive(true);
        userRepository.save(user);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Parent account approved successfully.");
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{userId}/reject")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Map<String, String>> rejectParent(@PathVariable Long userId) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        User teacherUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher user not found"));
        com.kce.project.entity.Teacher teacher = teacherRepository.findByUserUserId(teacherUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher details not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        com.kce.project.entity.Parent parent = parentRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));

        var student = parent.getStudent();
        if (student == null || student.getSchoolClass() == null || student.getSchoolClass().getTeacher() == null ||
                !student.getSchoolClass().getTeacher().getTeacherId().equals(teacher.getTeacherId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        parentRepository.delete(parent);
        userRepository.delete(user);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Parent registration request rejected.");
        return ResponseEntity.ok(resp);
    }
}
