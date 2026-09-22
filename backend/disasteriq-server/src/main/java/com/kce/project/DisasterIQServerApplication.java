package com.kce.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.kce.project")
@EntityScan(basePackages = "com.kce.project.entity")
@EnableJpaRepositories(basePackages = "com.kce.project.repository")
public class DisasterIQServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DisasterIQServerApplication.class, args);
    }
}
