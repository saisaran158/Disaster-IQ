package com.kce.project.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kce.project.entity.User;
import com.kce.project.enums.Role;

public interface UserRepository extends JpaRepository<User, Long> {

    java.util.List<User> findByRoleAndActive(Role role, boolean active);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u LEFT JOIN FETCH u.school WHERE u.role = :role AND u.active = :active")
    java.util.List<User> findByRoleAndActiveFetchSchool(@org.springframework.data.repository.query.Param("role") Role role, @org.springframework.data.repository.query.Param("active") boolean active);


    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
    
    long countByRole(Role role);

    long countByRoleAndActive(Role role, boolean active);

    long countByActive(boolean active);

}