package com.kce.project.entity;


import java.util.List;

import com.kce.project.enums.DifficultyLevel;
import com.kce.project.enums.DisasterType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Enumerated(EnumType.STRING)
    private DisasterType disasterType;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

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
