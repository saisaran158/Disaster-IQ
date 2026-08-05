package com.kce.project.service.impl;

import com.kce.project.dto.request.LoginRequestDTO;
import com.kce.project.dto.request.RegisterRequestDTO;
import com.kce.project.dto.response.LoginResponseDTO;
import com.kce.project.dto.response.RegisterResponseDTO;
import com.kce.project.entity.School;
import com.kce.project.entity.User;
import com.kce.project.exception.BadRequestException;
import com.kce.project.exception.ResourceAlreadyExistsException;
import com.kce.project.exception.ResourceNotFoundException;
import com.kce.project.repository.SchoolRepository;
import com.kce.project.repository.UserRepository;
import com.kce.project.security.jwt.JwtService;
import com.kce.project.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final SchoolRepository schoolRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    @Override
    public RegisterResponseDTO register(RegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists.");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ResourceAlreadyExistsException("Phone number already exists.");
        }

        School school = null;

        if (request.getSchoolId() != null) {
            school = schoolRepository.findById(request.getSchoolId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("School not found."));
        }

        com.kce.project.entity.User newUser =
                com.kce.project.entity.User.builder()
                        .fullName(request.getFullName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .phone(request.getPhone())
                        .role(request.getRole())
                        .school(school)
                        .active(true)
                        .build();

        newUser = userRepository.save(newUser);

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

        return LoginResponseDTO.builder()
                .token(token)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}