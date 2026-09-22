package com.kce.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @Column(unique = true)
    private String rollNumber;

    @Column(unique = true)
    private String admissionNumber;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<StudentProgress> progress = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<AssessmentResult> results = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "student",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<AIRecommendation> recommendations = new ArrayList<>();
}