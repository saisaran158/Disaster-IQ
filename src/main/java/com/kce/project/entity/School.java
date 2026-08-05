package com.kce.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class School extends BaseEntity {

    @Id
    @SequenceGenerator(
            name = "school_seq",
            sequenceName = "school_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "school_seq"
    )
    @Column(name = "school_id")
    private Long schoolId;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String schoolName;

    @NotBlank
    private String district;

    @NotBlank
    private String state;

    private String address;

    private String pincode;

    private String phone;

    @Email
    @Column(unique = true)
    private String email;

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "school",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "school",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<Teacher> teachers = new ArrayList<>();

    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "school",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<Student> students = new ArrayList<>();
    
    @Builder.Default
    @JsonIgnore
    @OneToMany(mappedBy = "school",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<SchoolClass> classes = new ArrayList<>();

}