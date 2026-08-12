package com.kce.project.repository;

import com.kce.project.entity.Student;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @EntityGraph(attributePaths = {"user", "school", "schoolClass"})
    Optional<Student> findByUserUserId(Long userId);


    boolean existsByRollNumber(String rollNumber);

    java.util.Optional<Student> findByRollNumber(String rollNumber);

    boolean existsByAdmissionNumber(String admissionNumber);

    @EntityGraph(attributePaths = {
            "user",
            "school",
            "schoolClass"
    })
    List<Student> findAll();

    @EntityGraph(attributePaths = {
            "user",
            "school",
            "schoolClass"
    })
    Optional<Student> findById(Long id);

    @EntityGraph(attributePaths = {
            "user",
            "school",
            "schoolClass"
    })
    List<Student> findBySchoolSchoolId(Long schoolId);

    @EntityGraph(attributePaths = {
            "user",
            "school",
            "schoolClass"
    })
    List<Student> findBySchoolClassClassId(Long classId);

    long countBySchoolClassClassId(Long classId);
}