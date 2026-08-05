package com.kce.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kce.project.enums.DisasterType;
import com.kce.project.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "simulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Simulation extends BaseEntity {

    @Id
    @SequenceGenerator(
            name = "simulation_seq",
            sequenceName = "simulation_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "simulation_seq"
    )
    @Column(name = "simulation_id")
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

    @Builder.Default
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher createdBy;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "simulation",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<Assignment> assignments = new ArrayList<>();

    @OneToOne(mappedBy = "simulation",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private Assessment assessment;
    
    @OneToMany(mappedBy = "simulation")
    private List<AIRecommendation> recommendations;

}