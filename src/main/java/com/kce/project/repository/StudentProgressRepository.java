package com.kce.project.repository;

import com.kce.project.entity.StudentProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {

    List<StudentProgress> findByStudentStudentId(Long studentId);

}