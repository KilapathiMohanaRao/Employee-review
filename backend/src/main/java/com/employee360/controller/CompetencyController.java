package com.employee360.controller;

import com.employee360.dto.ApiResponse;
import com.employee360.dto.BehaviourDto;
import com.employee360.dto.CompetencyDto;
import com.employee360.service.CompetencyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competencies")
public class CompetencyController {

    private final CompetencyService competencyService;

    public CompetencyController(CompetencyService competencyService) {
        this.competencyService = competencyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CompetencyDto>>> getAllCompetencies() {
        return ResponseEntity.ok(ApiResponse.success(competencyService.getAllCompetencies()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompetencyDto>> getCompetencyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(competencyService.getCompetencyById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<CompetencyDto>> createCompetency(@Valid @RequestBody CompetencyDto dto) {
        CompetencyDto created = competencyService.createCompetency(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Competency created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<CompetencyDto>> updateCompetency(@PathVariable Long id, @Valid @RequestBody CompetencyDto dto) {
        CompetencyDto updated = competencyService.updateCompetency(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Competency updated successfully", updated));
    }

    @PostMapping("/{id}/behaviours")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'HR_ADMIN')")
    public ResponseEntity<ApiResponse<BehaviourDto>> addBehaviour(@PathVariable Long id, @Valid @RequestBody BehaviourDto dto) {
        BehaviourDto created = competencyService.addBehaviour(id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Behaviour added successfully", created));
    }
}
