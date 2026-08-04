package com.kce.project.repository;

import com.kce.project.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByClassRoomClassId(Long classId);

    List<Student> findBySchoolSchoolId(Long schoolId);

}