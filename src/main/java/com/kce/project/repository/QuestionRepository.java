package com.kce.project.repository;

import com.kce.project.entity.Question;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @EntityGraph(attributePaths = {"assessment"})
    List<Question> findAll();

    @EntityGraph(attributePaths = {"assessment"})
    Optional<Question> findById(Long id);

    @EntityGraph(attributePaths = {"assessment"})
    List<Question> findByAssessmentAssessmentId(Long assessmentId);

}