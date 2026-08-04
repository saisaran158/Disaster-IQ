package com.kce.project.repository;

import com.kce.project.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByAssessmentAssessmentId(Long assessmentId);

}