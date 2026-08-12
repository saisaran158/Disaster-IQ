package com.kce.project.controller;

import com.kce.project.entity.User;
import com.kce.project.enums.Role;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class AdminTeacherApprovalController {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingTeachers() {
        List<User> pendingUsers = userRepository.findByRoleAndActive(Role.TEACHER, false);
        List<Map<String, Object>> response = pendingUsers.stream().map(user -> {
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
    public ResponseEntity<Map<String, String>> approveTeacher(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setActive(true);
        userRepository.save(user);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Teacher account approved successfully.");
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/{userId}/reject")
    public ResponseEntity<Map<String, String>> rejectTeacher(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        teacherRepository.findByUserUserId(userId).ifPresent(teacherRepository::delete);
        userRepository.delete(user);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Teacher registration request rejected.");
        return ResponseEntity.ok(resp);
    }
}
