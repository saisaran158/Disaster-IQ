package com.kce.project.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assessmentId;

    private String title;

    private Integer totalMarks;

    private Integer duration;

    private Integer passingMarks;

    @OneToOne
    @JoinColumn(name = "simulation_id")
    private Simulation simulation;

    @OneToMany(mappedBy = "assessment")
    private List<Question> questions;
}