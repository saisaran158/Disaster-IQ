package com.kce.project.controller;

import com.kce.project.dto.request.QuestionOptionRequestDTO;
import com.kce.project.dto.response.QuestionOptionResponseDTO;
import com.kce.project.service.QuestionOptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class QuestionOptionController {

    private final QuestionOptionService optionService;

    @PostMapping
    public ResponseEntity<QuestionOptionResponseDTO> createOption(
            @Valid @RequestBody QuestionOptionRequestDTO request){

        return new ResponseEntity<>(
                optionService.createOption(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuestionOptionResponseDTO>> getAllOptions(){

        return ResponseEntity.ok(optionService.getAllOptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionOptionResponseDTO> getOption(
            @PathVariable Long id){

        return ResponseEntity.ok(optionService.getOption(id));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<QuestionOptionResponseDTO>> getOptionsByQuestion(
            @PathVariable Long questionId){

        return ResponseEntity.ok(
                optionService.getOptionsByQuestion(questionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionOptionResponseDTO> updateOption(
            @PathVariable Long id,
            @Valid @RequestBody QuestionOptionRequestDTO request){

        return ResponseEntity.ok(
                optionService.updateOption(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOption(
            @PathVariable Long id){

        optionService.deleteOption(id);

        return ResponseEntity.ok("Option deleted successfully");
    }
}