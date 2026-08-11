package com.kce.project.repository;

import com.kce.project.entity.School;
import com.kce.project.entity.Teacher;
import com.kce.project.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    boolean existsByEmployeeId(String employeeId);

    boolean existsByUser(User user);

    List<Teacher> findBySchool(School school);

    @EntityGraph(attributePaths = {"user", "school"})
    List<Teacher> findAll();

    @EntityGraph(attributePaths = {"user", "school"})
    Optional<Teacher> findById(Long id);

    @EntityGraph(attributePaths = {"user", "school"})
    List<Teacher> findBySchoolSchoolId(Long schoolId);
}