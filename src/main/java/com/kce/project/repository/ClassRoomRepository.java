package com.kce.project.repository;

import com.kce.project.entity.ClassRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {

    List<ClassRoom> findByTeacherTeacherId(Long teacherId);

}