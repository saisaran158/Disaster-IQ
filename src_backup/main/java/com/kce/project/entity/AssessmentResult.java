package com.kce.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessment_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResult extends BaseEntity {

    @Id
    @SequenceGenerator(
            name = "result_seq",
            sequenceName = "result_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "result_seq"
    )
    @Column(name = "result_id")
    private Long resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    private Integer score;

    private Integer totalMarks;

    private Double percentage;

    private Boolean passed;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "assessmentResult",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<StudentAnswer> answers = new ArrayList<>();

}