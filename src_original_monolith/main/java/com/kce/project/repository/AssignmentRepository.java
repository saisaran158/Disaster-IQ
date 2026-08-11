package com.kce.project.repository;

import com.kce.project.entity.Assignment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    @EntityGraph(attributePaths = {
            "teacher",
            "teacher.user",
            "schoolClass",
            "simulation"
    })
    List<Assignment> findAll();

    @EntityGraph(attributePaths = {
            "teacher",
            "teacher.user",
            "schoolClass",
            "simulation"
    })
    Optional<Assignment> findById(Long id);

    @EntityGraph(attributePaths = {
            "teacher",
            "teacher.user",
            "schoolClass",
            "simulation"
    })
    List<Assignment> findByTeacherTeacherId(Long teacherId);

    @EntityGraph(attributePaths = {
            "teacher",
            "teacher.user",
            "schoolClass",
            "simulation"
    })
    List<Assignment> findBySchoolClassClassId(Long classId);
}