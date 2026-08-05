package com.kce.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "question_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionOption extends BaseEntity {

    @Id
    @SequenceGenerator(
            name = "option_seq",
            sequenceName = "option_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "option_seq"
    )
    @Column(name = "option_id")
    private Long optionId;

    @Column(length = 500)
    private String optionText;

    private Boolean correct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

}