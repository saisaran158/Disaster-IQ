package com.kce.project.repository;

import com.kce.project.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepository extends JpaRepository<School, Long> {

    boolean existsBySchoolName(String schoolName);

}