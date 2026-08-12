package com.kce.project.repository;

import com.kce.project.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository
        extends JpaRepository<StudentProgress, Long> {

    List<StudentProgress> findByStudentStudentId(Long studentId);

    Optional<StudentProgress> findByStudentStudentIdAndAssignmentAssignmentId(
            Long studentId,
            Long assignmentId);

    long countByAssignmentAssignmentIdAndStatus(Long assignmentId, com.kce.project.enums.SimulationStatus status);

    long countByStudentStudentIdAndStatus(Long studentId, com.kce.project.enums.SimulationStatus status);

}