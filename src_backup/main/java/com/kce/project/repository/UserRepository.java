package com.kce.project.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kce.project.entity.User;
import com.kce.project.enums.Role;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
    
    long countByRole(Role role);

}