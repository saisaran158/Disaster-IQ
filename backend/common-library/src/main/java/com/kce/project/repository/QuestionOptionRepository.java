package com.kce.project.repository;

import com.kce.project.entity.QuestionOption;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {

    @EntityGraph(attributePaths = {"question"})
    List<QuestionOption> findAll();

    @EntityGraph(attributePaths = {"question"})
    Optional<QuestionOption> findById(Long id);

    @EntityGraph(attributePaths = {"question"})
    List<QuestionOption> findByQuestionQuestionId(Long questionId);

}