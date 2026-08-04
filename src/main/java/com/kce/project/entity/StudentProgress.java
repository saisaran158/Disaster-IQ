package com.kce.project.entity;


import com.kce.project.enums.SimulationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Enumerated(EnumType.STRING)
    private SimulationStatus status;

    private Integer completionPercentage;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

}
