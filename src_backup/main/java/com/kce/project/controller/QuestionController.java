package com.kce.project.controller;

import com.kce.project.dto.request.QuestionRequestDTO;
import com.kce.project.dto.response.QuestionResponseDTO;
import com.kce.project.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponseDTO> createQuestion(
            @Valid @RequestBody QuestionRequestDTO request){

        return new ResponseEntity<>(
                questionService.createQuestion(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponseDTO>> getAllQuestions(){

        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> getQuestionById(
            @PathVariable Long id){

        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<List<QuestionResponseDTO>> getQuestionsByAssessment(
            @PathVariable Long assessmentId){

        return ResponseEntity.ok(
                questionService.getQuestionsByAssessment(assessmentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequestDTO request){

        return ResponseEntity.ok(
                questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(
            @PathVariable Long id){

        questionService.deleteQuestion(id);

        return ResponseEntity.ok("Question deleted successfully");
    }

}