package com.kce.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kce.project.entity.School;
import com.kce.project.entity.SchoolClass;

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
	boolean existsByClassNameAndSectionAndAcademicYear(String className, String section, String academicYear);

	@EntityGraph(attributePaths = { "school" })
	List<SchoolClass> findBySchool(School school);

	@EntityGraph(attributePaths = { "school" })
	List<SchoolClass> findAll();

	@EntityGraph(attributePaths = { "school" })
	Optional<SchoolClass> findById(Long id);

	boolean existsByClassNameAndSectionAndSchool(String className, String section, School school);
	
	

}