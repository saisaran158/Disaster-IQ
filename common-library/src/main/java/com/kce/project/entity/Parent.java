package com.kce.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_id")
    private Long parentId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", unique = true)
    private Student student;

    private String occupation;

    private String relationship;
}