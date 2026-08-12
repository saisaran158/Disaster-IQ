package com.kce.project.service.impl;

import com.kce.project.dto.request.AssignmentRequestDTO;
import com.kce.project.dto.response.AssignmentResponseDTO;
import com.kce.project.entity.Assignment;
import com.kce.project.entity.AssessmentResult;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Simulation;
import com.kce.project.entity.StudentProgress;
import com.kce.project.entity.Teacher;
import com.kce.project.enums.SimulationStatus;
import com.kce.project.mapper.AssignmentMapper;
import com.kce.project.repository.AssessmentRepository;
import com.kce.project.repository.AssessmentResultRepository;
import com.kce.project.repository.StudentRepository;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SimulationRepository;
import com.kce.project.repository.StudentProgressRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kce.project.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SimulationRepository simulationRepository;
    private final AssignmentMapper assignmentMapper;
    private final StudentProgressRepository progressRepository;
    private final AssessmentResultRepository resultRepository;
    private final AssessmentRepository assessmentRepository;
    private final StudentRepository studentRepository;

    private AssignmentResponseDTO mapToResponseWithCounts(Assignment assignment) {
        AssignmentResponseDTO dto = assignmentMapper.toResponse(assignment);
        if (assignment.getSchoolClass() != null) {
            dto.setAssignedCount((int) studentRepository.countBySchoolClassClassId(assignment.getSchoolClass().getClassId()));
        }
        dto.setCompletedCount((int) progressRepository.countByAssignmentAssignmentIdAndStatus(assignment.getAssignmentId(), com.kce.project.enums.SimulationStatus.COMPLETED));
        return dto;
    }

    @Override
    public AssignmentResponseDTO createAssignment(AssignmentRequestDTO request) {

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new ResourceNotFoundException("Simulation not found"));

        Assignment assignment = Assignment.builder()
                .teacher(teacher)
                .schoolClass(schoolClass)
                .simulation(simulation)
                .assignedDate(request.getAssignedDate())
                .dueDate(request.getDueDate())
                .status(request.getStatus())
                .instructions(request.getInstructions())
                .build();

        return mapToResponseWithCounts(
                assignmentRepository.save(assignment));
    }

    @Override
    public AssignmentResponseDTO getAssignmentById(Long assignmentId) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        return mapToResponseWithCounts(assignment);
    }

    @Override
    public List<AssignmentResponseDTO> getAllAssignments() {

        return assignmentRepository.findAll()
                .stream()
                .map(this::mapToResponseWithCounts)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponseDTO> getAssignmentsByTeacher(Long teacherId) {

        return assignmentRepository.findByTeacherTeacherId(teacherId)
                .stream()
                .map(this::mapToResponseWithCounts)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponseDTO> getAssignmentsByClass(Long classId) {

        return assignmentRepository.findBySchoolClassClassId(classId)
                .stream()
                .map(this::mapToResponseWithCounts)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponseDTO> getAssignmentsForStudent(Long studentId, Long classId) {
        List<Assignment> assignments = assignmentRepository.findBySchoolClassClassId(classId);

        return assignments.stream().map(assignment -> {
            AssignmentResponseDTO dto = mapToResponseWithCounts(assignment);

            // Check student progress for this assignment
            Optional<StudentProgress> progressOpt =
                progressRepository.findByStudentStudentIdAndAssignmentAssignmentId(
                    studentId, assignment.getAssignmentId());

            if (progressOpt.isPresent()) {
                StudentProgress progress = progressOpt.get();
                if (progress.getStatus() == SimulationStatus.COMPLETED) {
                    dto.setStudentStatus("COMPLETED");
                    // Fetch score from assessment results for this simulation
                    try {
                        assessmentRepository.findBySimulationSimulationId(assignment.getSimulation().getSimulationId())
                            .ifPresent(assess -> {
                                List<AssessmentResult> results =
                                    resultRepository.findByStudentStudentId(studentId);
                                results.stream()
                                    .filter(r -> r.getAssessment().getAssessmentId().equals(assess.getAssessmentId()))
                                    .findFirst()
                                    .ifPresent(r -> dto.setScore(r.getPercentage()));
                            });
                    } catch (Exception e) {
                        // skip score if assessment not found
                    }
                } else if (progress.getStatus() == SimulationStatus.IN_PROGRESS) {
                    dto.setStudentStatus("IN_PROGRESS");
                } else {
                    dto.setStudentStatus("PENDING");
                }
            } else {
                dto.setStudentStatus("PENDING");
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public AssignmentResponseDTO updateAssignment(Long assignmentId,
                                                  AssignmentRequestDTO request) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new ResourceNotFoundException("Simulation not found"));

        assignment.setTeacher(teacher);
        assignment.setSchoolClass(schoolClass);
        assignment.setSimulation(simulation);
        assignment.setAssignedDate(request.getAssignedDate());
        assignment.setDueDate(request.getDueDate());
        assignment.setStatus(request.getStatus());
        assignment.setInstructions(request.getInstructions());

        return mapToResponseWithCounts(
                assignmentRepository.save(assignment));
    }

    @Override
    public void deleteAssignment(Long assignmentId) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        assignmentRepository.delete(assignment);
    }
}