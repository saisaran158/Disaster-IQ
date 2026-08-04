package com.kce.project.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "simulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long simulationId;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String disasterType;

    private String difficulty;

    private Integer duration;

    private String thumbnail;

    private boolean active;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher createdBy;

    @OneToMany(mappedBy = "simulation")
    private List<Assignment> assignments;

    @OneToOne(mappedBy = "simulation")
    private Assessment assessment;
}
