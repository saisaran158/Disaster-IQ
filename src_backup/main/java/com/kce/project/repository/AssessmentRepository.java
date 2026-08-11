package com.kce.project.repository;

import com.kce.project.entity.Assessment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    @EntityGraph(attributePaths = {
            "simulation"
    })
    List<Assessment> findAll();

    @EntityGraph(attributePaths = {
            "simulation"
    })
    Optional<Assessment> findById(Long id);

    @EntityGraph(attributePaths = {
            "simulation"
    })
    Optional<Assessment> findBySimulationSimulationId(Long simulationId);
}