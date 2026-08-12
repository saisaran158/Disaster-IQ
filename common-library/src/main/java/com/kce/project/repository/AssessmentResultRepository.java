package com.kce.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kce.project.entity.AssessmentResult;

public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {

	@EntityGraph(attributePaths = { "student", "assessment" })
	List<AssessmentResult> findByStudentStudentId(Long studentId);

	List<AssessmentResult> findByAssessmentSimulationCreatedByTeacherId(Long teacherId);

	List<AssessmentResult> findByStudentSchoolClassClassId(Long classId);
}