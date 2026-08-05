package com.kce.project.repository;

import com.kce.project.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByTeacherTeacherId(Long teacherId);

    List<Assignment> findByClassRoomClassId(Long classId);

}