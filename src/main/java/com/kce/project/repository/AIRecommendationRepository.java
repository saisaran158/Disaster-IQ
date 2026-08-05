package com.kce.project.repository;

import com.kce.project.entity.AIRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIRecommendationRepository extends JpaRepository<AIRecommendation, Long> {

    List<AIRecommendation> findByStudentStudentId(Long studentId);

}