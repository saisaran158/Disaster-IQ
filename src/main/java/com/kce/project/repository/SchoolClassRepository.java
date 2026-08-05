package com.kce.project.repository;

import com.kce.project.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {

    // Find all classes handled by a teacher
    List<SchoolClass> findByTeacherTeacherId(Long teacherId);

    // Find all classes in a school
    List<SchoolClass> findBySchoolSchoolId(Long schoolId);

    // Find a class by name
    List<SchoolClass> findByClassName(String className);

    // Find a class by name and section
    List<SchoolClass> findByClassNameAndSection(String className, String section);

    // Check if a class already exists
    boolean existsByClassNameAndSectionAndAcademicYear(
            String className,
            String section,
            String academicYear
    );

}