package com.kce.project.repository;

import com.kce.project.entity.Assignment;
import com.kce.project.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByTeacherTeacherId(Long teacherId);

    List<Student> findBySchoolClassClassId(Long classId);

}