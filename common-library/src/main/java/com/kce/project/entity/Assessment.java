package com.kce.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Long assessmentId;

    @Column(nullable = false)
    private String title;

    private Integer totalMarks;

    private Integer passingMarks;

    private Integer duration;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_id")
    private Simulation simulation;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "assessment",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "assessment")
    private List<AssessmentResult> results;

}