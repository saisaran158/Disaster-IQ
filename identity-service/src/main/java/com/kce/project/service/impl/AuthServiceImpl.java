package com.kce.project.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kce.project.dto.request.LoginRequestDTO;
import com.kce.project.dto.request.RegisterRequestDTO;
import com.kce.project.dto.request.UpdateProfileRequestDTO;
import com.kce.project.dto.response.LoginResponseDTO;
import com.kce.project.dto.response.RegisterResponseDTO;
import com.kce.project.dto.response.UserProfileResponseDTO;
import com.kce.project.entity.Parent;
import com.kce.project.entity.School;
import com.kce.project.entity.Student;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.User;
import com.kce.project.enums.Role;
import com.kce.project.exception.BadRequestException;
import com.kce.project.exception.ResourceAlreadyExistsException;
import com.kce.project.repository.ParentRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.security.jwt.JwtService;
import com.kce.project.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final SchoolRepository schoolRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final SchoolClassRepository schoolClassRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    private static final java.util.Map<String, String> otpStore = new java.util.concurrent.ConcurrentHashMap<>();

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists.");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ResourceAlreadyExistsException("Phone number already exists.");
        }

        School school = null;

        if (request.getSchoolName() != null && !request.getSchoolName().trim().isEmpty()) {
            school = schoolRepository.findBySchoolName(request.getSchoolName().trim()).orElse(null);
            if (school == null) {
                String dist = (request.getSchoolDistrict() != null && !request.getSchoolDistrict().trim().isEmpty())
                        ? request.getSchoolDistrict().trim() : "Local District";
                School newSchool = School.builder()
                        .schoolName(request.getSchoolName().trim())
                        .district(dist)
                        .state("State A")
                        .address(dist + " Address")
                        .email("contact@" + request.getSchoolName().toLowerCase().replaceAll("\\s+", "") + ".edu")
                        .phone("1234567890")
                        .build();
                school = schoolRepository.save(newSchool);
            }
        }

        if (school == null && request.getSchoolId() != null) {
            school = schoolRepository.findById(request.getSchoolId()).orElse(null);
        }

        if (school == null) {
            school = schoolRepository.findAll().stream().findFirst().orElse(null);
        }

        com.kce.project.entity.User newUser =
                com.kce.project.entity.User.builder()
                        .fullName(request.getFullName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .phone(request.getPhone())
                        .role(request.getRole())
                        .school(school)
                        .plainPassword(request.getPassword())
                        .active((request.getRole() == Role.TEACHER || request.getRole() == Role.PARENT) ? false : true)
                        .build();

        newUser = userRepository.save(newUser);

        // Automatically create associated role entity
        if (newUser.getRole() == Role.STUDENT) {
            Teacher loggedInTeacher = null;
            try {
                var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                    String currentEmail = auth.getName();
                    var teacherUserOpt = userRepository.findByEmail(currentEmail);
                    if (teacherUserOpt.isPresent() && teacherUserOpt.get().getRole() == Role.TEACHER) {
                        loggedInTeacher = teacherRepository.findByUserUserId(teacherUserOpt.get().getUserId()).orElse(null);
                    }
                }
            } catch (Exception ex) {
                // Ignore any security context exception
            }

            var schoolClass = schoolClassRepository.findAll().stream().findFirst().orElse(null);
            if (request.getClassName() != null && !request.getClassName().trim().isEmpty()) {
                final String clsName = request.getClassName().trim();
                final String secName = request.getSection() != null ? request.getSection().trim() : "A";
                schoolClass = schoolClassRepository.findAll().stream()
                        .filter(c -> c.getClassName().equalsIgnoreCase(clsName) && c.getSection().equalsIgnoreCase(secName))
                        .findFirst()
                        .orElse(null);
                if (schoolClass == null) {
                    com.kce.project.entity.SchoolClass newCls = com.kce.project.entity.SchoolClass.builder()
                            .className(clsName)
                            .section(secName)
                            .school(school)
                            .teacher(loggedInTeacher)
                            .build();
                    schoolClass = schoolClassRepository.save(newCls);
                } else if (loggedInTeacher != null) {
                    schoolClass.setTeacher(loggedInTeacher);
                    schoolClass = schoolClassRepository.save(schoolClass);
                }
            }
            String rollNo = (request.getStudentRoll() != null && !request.getStudentRoll().trim().isEmpty())
                    ? request.getStudentRoll().trim()
                    : "ROLL-" + newUser.getUserId();
            Student student = Student.builder()
                    .user(newUser)
                    .school(school)
                    .schoolClass(schoolClass)
                    .rollNumber(rollNo)
                    .admissionNumber("ADM-" + newUser.getUserId())
                    .build();
            studentRepository.save(student);
        } else if (newUser.getRole() == Role.TEACHER) {
            Teacher teacher = Teacher.builder()
                    .user(newUser)
                    .school(school)
                    .employeeId("TCH-" + newUser.getUserId())
                    .qualification("Master of Science")
                    .specialization("Disaster Preparedness & Response")
                    .build();
            teacherRepository.save(teacher);
        } else if (newUser.getRole() == Role.PARENT) {
            Student student = null;
            if (request.getStudentRoll() != null && !request.getStudentRoll().trim().isEmpty()) {
                student = studentRepository.findByRollNumber(request.getStudentRoll().trim()).orElse(null);
            }
            if (student == null && request.getStudentName() != null && !request.getStudentName().trim().isEmpty()) {
                final String sName = request.getStudentName().trim();
                student = studentRepository.findAll().stream()
                        .filter(s -> s.getUser() != null && s.getUser().getFullName().equalsIgnoreCase(sName))
                        .findFirst()
                        .orElse(null);
            }
            if (student == null) {
                // Auto-create a student user and student record if none matches
                String stdName = request.getStudentName() != null ? request.getStudentName().trim() : "Student Child";
                String stdRoll = request.getStudentRoll() != null ? request.getStudentRoll().trim() : "ROLL-" + System.currentTimeMillis();
                String stdEmail = stdName.toLowerCase().replaceAll("\\s+", "") + stdRoll.toLowerCase() + "@disasteriq.com";
                if (userRepository.existsByEmail(stdEmail)) {
                    stdEmail = "std" + System.currentTimeMillis() + "@disasteriq.com";
                }
                com.kce.project.entity.User stdUser = com.kce.project.entity.User.builder()
                        .fullName(stdName)
                        .email(stdEmail)
                        .password(passwordEncoder.encode("student123"))
                        .phone("9876543210")
                        .role(Role.STUDENT)
                        .school(school)
                        .active(true)
                        .build();
                stdUser = userRepository.save(stdUser);

                var schoolClass = schoolClassRepository.findAll().stream().findFirst().orElse(null);
                student = Student.builder()
                        .user(stdUser)
                        .school(school)
                        .schoolClass(schoolClass)
                        .rollNumber(stdRoll)
                        .admissionNumber("ADM-" + stdUser.getUserId())
                        .build();
                student = studentRepository.save(student);
            }

            Parent parent = Parent.builder()
                    .user(newUser)
                    .student(student)
                    .relationship("Parent")
                    .occupation("Guardian")
                    .build();
            parentRepository.save(parent);
        }

        return RegisterResponseDTO.builder()
                .userId(newUser.getUserId())
                .fullName(newUser.getFullName())
                .email(newUser.getEmail())
                .message("Registration Successful")
                .build();
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        com.kce.project.entity.User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("Invalid Email or Password"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        Long studentId = null;
        Long teacherId = null;
        Long parentId = null;

        if (user.getRole() == Role.STUDENT) {
            studentId = studentRepository.findByUserUserId(user.getUserId())
                    .map(Student::getStudentId).orElse(null);
        } else if (user.getRole() == Role.TEACHER) {
            teacherId = teacherRepository.findByUserUserId(user.getUserId())
                    .map(Teacher::getTeacherId).orElse(null);
        } else if (user.getRole() == Role.PARENT) {
            parentId = parentRepository.findByUserUserId(user.getUserId())
                    .map(Parent::getParentId).orElse(null);
        }

        return LoginResponseDTO.builder()
                .token(token)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .studentId(studentId)
                .teacherId(teacherId)
                .parentId(parentId)
                .build();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public UserProfileResponseDTO updateProfile(String email, UpdateProfileRequestDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            // Check uniqueness only if phone is changing
            if (!request.getPhone().trim().equals(user.getPhone())) {
                if (userRepository.existsByPhone(request.getPhone().trim())) {
                    throw new BadRequestException("Phone number already in use by another account.");
                }
            }
            user.setPhone(request.getPhone().trim());
        }

        userRepository.save(user);

        return UserProfileResponseDTO.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public UserProfileResponseDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return UserProfileResponseDTO.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public java.util.Map<String, String> generateOtp(com.kce.project.dto.request.ForgotPasswordRequestDTO request) {
        String email = request.getEmail();
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email is required.");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new BadRequestException("No account registered with this email."));

        if (user.getRole() != Role.TEACHER && user.getRole() != Role.PARENT) {
            throw new BadRequestException("Password reset via OTP is only available for Parents and Teachers.");
        }

        String otp = String.format("%04d", new java.util.Random().nextInt(10000));
        otpStore.put(email.trim(), otp);

        System.out.println("----------------------------------------");
        System.out.println("[OTP RESET] OTP for user " + email + " is: " + otp);
        System.err.println("[OTP RESET] OTP for user " + email + " is: " + otp);
        System.out.println("----------------------------------------");

        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("disaster.iq8@gmail.com");
            message.setTo(email.trim());
            message.setSubject("DisasterIQ Password Reset Verification Code");
            message.setText("Hello,\n\nYou requested a password reset on DisasterIQ. Your 4-digit OTP verification code is:\n\n"
                    + otp + "\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nDisasterIQ Team");
            mailSender.send(message);
            System.out.println("[EMAIL SUCCESS] Sent OTP to " + email);
        } catch (Exception e) {
            System.err.println("[EMAIL ERROR] Failed to send email to " + email + ": " + e.getMessage());
            e.printStackTrace();
        }

        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Verification code sent to " + email);
        // We also return it in the payload for local development/test ease
        response.put("otp", otp);
        response.put("email", email);
        return response;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void resetPassword(com.kce.project.dto.request.ResetPasswordRequestDTO request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();

        if (email == null || email.trim().isEmpty() || otp == null || otp.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            throw new BadRequestException("Email, OTP code, and new password are required.");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> new BadRequestException("User not found."));

        if (user.getRole() != Role.TEACHER && user.getRole() != Role.PARENT) {
            throw new BadRequestException("Password reset via OTP is only available for Parents and Teachers.");
        }

        String storedOtp = otpStore.get(email.trim());
        if (storedOtp == null || !storedOtp.equals(otp.trim())) {
            throw new BadRequestException("Invalid or expired OTP verification code.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        user.setPlainPassword(newPassword.trim());
        userRepository.save(user);

        // Remove OTP
        otpStore.remove(email.trim());
    }
}