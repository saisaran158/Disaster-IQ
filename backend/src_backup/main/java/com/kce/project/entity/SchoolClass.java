package com.kce.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "school_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolClass extends BaseEntity {

    @Id
    @SequenceGenerator(
            name = "class_seq",
            sequenceName = "class_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "class_seq"
    )
    @Column(name = "class_id")
    private Long classId;

    @Column(nullable = false)
    private String className;

    private String section;

    private String academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "schoolClass",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<Student> students = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "schoolClass",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<Assignment> assignments = new ArrayList<>();
}