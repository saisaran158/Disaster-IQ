package com.kce.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kce.project.dto.response.ParentDashboardResponseDTO;
import com.kce.project.entity.Parent;
import com.kce.project.entity.User;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.repository.ParentRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.service.ParentDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/parent/dashboard")
@RequiredArgsConstructor
public class ParentDashboardController {

    private final ParentDashboardService dashboardService;
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;
    private final com.kce.project.repository.StudentRepository studentRepository;

    @GetMapping("/me")
    public ResponseEntity<ParentDashboardResponseDTO> getMyDashboard() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Parent parent = parentRepository.findByUserUserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        if (parent.getStudent() == null) {
            throw new ResourceNotFoundException("No child linked to this parent yet.");
        }
        return ResponseEntity.ok(dashboardService.getDashboard(parent.getStudent().getStudentId()));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<ParentDashboardResponseDTO> getDashboard(@PathVariable Long studentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == com.kce.project.enums.Role.PARENT) {
            Parent parent = parentRepository.findByUserUserId(user.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
            if (parent.getStudent() == null || !parent.getStudent().getStudentId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.ok(dashboardService.getDashboard(studentId));
    }

    @org.springframework.web.bind.annotation.PostMapping("/notify-email")
    public ResponseEntity<java.util.Map<String, Object>> notifyParentEmail(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, Object> request) {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        try {
            String title = request.get("title").toString();
            Double score = Double.valueOf(request.get("score").toString());

            // Resolve student from authenticated JWT — more reliable than client-supplied studentId
            String authEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User authUser = userRepository.findByEmail(authEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

            com.kce.project.entity.Student student = studentRepository.findByUserUserId(authUser.getUserId())
                    .orElse(null);

            // Fallback: if studentId was sent explicitly in the request, use it
            if (student == null && request.get("studentId") != null) {
                Long studentId = Long.valueOf(request.get("studentId").toString());
                student = studentRepository.findById(studentId).orElse(null);
            }

            if (student == null) {
                response.put("notified", false);
                response.put("message", "Student not found for the authenticated user.");
                return ResponseEntity.ok(response);
            }

            System.out.println("[NOTIFY-EMAIL] Looking for parent of studentId=" + student.getStudentId());

            java.util.Optional<Parent> parentOpt = parentRepository.findByStudentStudentId(student.getStudentId());
            System.out.println("[NOTIFY-EMAIL] Parent found: " + parentOpt.isPresent());

            if (parentOpt.isPresent()) {
                Parent parent = parentOpt.get();
                User parentUser = parent.getUser();
                if (parentUser != null && parentUser.getEmail() != null) {
                    String parentEmail = parentUser.getEmail();
                    org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
                    message.setTo(parentEmail);
                    message.setSubject("DisasterIQ: Drill Completion Safety Report");
                    String studentName = (student.getUser() != null) ? student.getUser().getFullName() : "Your child";
                    message.setText("Dear Parent/Guardian,\n\n"
                            + "We are pleased to inform you that your child, " + studentName + ",\n"
                            + "has successfully completed the \"" + title + "\" safety drill simulation.\n\n"
                            + "Drill Performance Details:\n"
                            + "- Score Obtained: " + Math.round(score) + "%\n"
                            + "- Status: " + (score >= 60 ? "Passed" : "Needs Review") + "\n\n"
                            + "Thank you for supporting disaster safety awareness and education!\n\n"
                            + "Best regards,\n"
                            + "DisasterIQ Team");
                    
                    // Send asynchronously to prevent HTTP gateway response timeout
                    java.util.concurrent.CompletableFuture.runAsync(() -> {
                        try {
                            mailSender.send(message);
                            System.out.println("[EMAIL SUCCESS] Sent score update to parent: " + parentEmail);
                        } catch (Exception ex) {
                            System.err.println("[EMAIL ERROR] Failed to send email to parent: " + parentEmail + ". Reason: " + ex.getMessage());
                        }
                    });
                    
                    response.put("notified", true);
                    response.put("email", parentEmail);
                    response.put("message", "Email successfully dispatched to parent: " + parentEmail);
                    return ResponseEntity.ok(response);
                }
            }
            response.put("notified", false);
            response.put("message", "No registered parent found for this student. No email sent.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("[NOTIFY-EMAIL ERROR] " + e.getMessage());
            response.put("notified", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
