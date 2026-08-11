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
public class StudentProgress extends BaseEntity {

    @Id
    @SequenceGenerator(
            name = "progress_seq",
            sequenceName = "progress_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "progress_seq"
    )
    @Column(name = "progress_id")
    private Long progressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Enumerated(EnumType.STRING)
    private SimulationStatus status;

    private Integer completionPercentage;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

}