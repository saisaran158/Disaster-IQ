package com.kce.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kce.project.entity.Simulation;

public interface SimulationRepository extends JpaRepository<Simulation, Long> {

    @EntityGraph(attributePaths = {
            "createdBy",
            "createdBy.user"
    })
    List<Simulation> findAll();

    @EntityGraph(attributePaths = {
            "createdBy",
            "createdBy.user"
    })
    Optional<Simulation> findById(Long id);

    @EntityGraph(attributePaths = {
            "createdBy",
            "createdBy.user"
    })
    List<Simulation> findByCreatedByTeacherId(Long teacherId);
    
    
    
}