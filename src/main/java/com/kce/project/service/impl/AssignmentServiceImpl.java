package com.kce.project.service.impl;

import com.kce.project.dto.request.AssignmentRequestDTO;
import com.kce.project.dto.response.AssignmentResponseDTO;
import com.kce.project.entity.Assignment;
import com.kce.project.entity.SchoolClass;
import com.kce.project.entity.Simulation;
import com.kce.project.entity.Teacher;
import com.kce.project.mapper.AssignmentMapper;
import com.kce.project.repository.AssignmentRepository;
import com.kce.project.repository.SchoolClassRepository;
import com.kce.project.repository.SimulationRepository;
import com.kce.project.repository.TeacherRepository;
import com.kce.project.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SimulationRepository simulationRepository;
    private final AssignmentMapper assignmentMapper;

    @Override
    public AssignmentResponseDTO createAssignment(AssignmentRequestDTO request) {

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new RuntimeException("Simulation not found"));

        Assignment assignment = Assignment.builder()
                .teacher(teacher)
                .schoolClass(schoolClass)
                .simulation(simulation)
                .assignedDate(request.getAssignedDate())
                .dueDate(request.getDueDate())
                .status(request.getStatus())
                .instructions(request.getInstructions())
                .build();

        return assignmentMapper.toResponse(
                assignmentRepository.save(assignment));
    }

    @Override
    public AssignmentResponseDTO getAssignmentById(Long assignmentId) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        return assignmentMapper.toResponse(assignment);
    }

    @Override
    public List<AssignmentResponseDTO> getAllAssignments() {

        return assignmentRepository.findAll()
                .stream()
                .map(assignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponseDTO> getAssignmentsByTeacher(Long teacherId) {

        return assignmentRepository.findByTeacherTeacherId(teacherId)
                .stream()
                .map(assignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponseDTO> getAssignmentsByClass(Long classId) {

        return assignmentRepository.findBySchoolClassClassId(classId)
                .stream()
                .map(assignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentResponseDTO updateAssignment(Long assignmentId,
                                                  AssignmentRequestDTO request) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new RuntimeException("Simulation not found"));

        assignment.setTeacher(teacher);
        assignment.setSchoolClass(schoolClass);
        assignment.setSimulation(simulation);
        assignment.setAssignedDate(request.getAssignedDate());
        assignment.setDueDate(request.getDueDate());
        assignment.setStatus(request.getStatus());
        assignment.setInstructions(request.getInstructions());

        return assignmentMapper.toResponse(
                assignmentRepository.save(assignment));
    }

    @Override
    public void deleteAssignment(Long assignmentId) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        assignmentRepository.delete(assignment);
    }
}