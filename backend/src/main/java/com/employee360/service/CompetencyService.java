package com.employee360.service;

import com.employee360.dto.BehaviourDto;
import com.employee360.dto.CompetencyDto;
import com.employee360.entity.Behaviour;
import com.employee360.entity.Competency;
import com.employee360.exception.BadRequestException;
import com.employee360.exception.ResourceNotFoundException;
import com.employee360.repository.BehaviourRepository;
import com.employee360.repository.CompetencyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompetencyService {

    private final CompetencyRepository competencyRepository;
    private final BehaviourRepository behaviourRepository;

    public CompetencyService(CompetencyRepository competencyRepository, BehaviourRepository behaviourRepository) {
        this.competencyRepository = competencyRepository;
        this.behaviourRepository = behaviourRepository;
    }

    @Transactional(readOnly = true)
    public List<CompetencyDto> getAllCompetencies() {
        return competencyRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompetencyDto getCompetencyById(Long id) {
        return competencyRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found with id: " + id));
    }

    @Transactional
    public CompetencyDto createCompetency(CompetencyDto dto) {
        if (competencyRepository.findByCode(dto.getCode()).isPresent()) {
            throw new BadRequestException("Competency code already exists: " + dto.getCode());
        }
        Competency comp = new Competency(dto.getName(), dto.getCode(), dto.getDescription(), dto.getCategory(), dto.getSortOrder());
        comp.setActive(true);

        if (dto.getBehaviours() != null) {
            for (BehaviourDto bDto : dto.getBehaviours()) {
                Behaviour b = new Behaviour(bDto.getTitle(), bDto.getDescription(), bDto.getSortOrder());
                b.setActive(true);
                comp.addBehaviour(b);
            }
        }
        Competency saved = competencyRepository.save(comp);
        return toDto(saved);
    }

    @Transactional
    public CompetencyDto updateCompetency(Long id, CompetencyDto dto) {
        Competency comp = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found with id: " + id));

        comp.setName(dto.getName());
        comp.setDescription(dto.getDescription());
        comp.setCategory(dto.getCategory());
        comp.setSortOrder(dto.getSortOrder());
        comp.setActive(dto.isActive());

        return toDto(competencyRepository.save(comp));
    }

    @Transactional
    public BehaviourDto addBehaviour(Long competencyId, BehaviourDto dto) {
        Competency comp = competencyRepository.findById(competencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found"));

        Behaviour b = new Behaviour(dto.getTitle(), dto.getDescription(), dto.getSortOrder());
        b.setActive(true);
        comp.addBehaviour(b);
        Behaviour saved = behaviourRepository.save(b);

        return toBehaviourDto(saved);
    }

    public CompetencyDto toDto(Competency c) {
        CompetencyDto dto = new CompetencyDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setCode(c.getCode());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setSortOrder(c.getSortOrder());
        dto.setActive(c.isActive());
        if (c.getBehaviours() != null) {
            dto.setBehaviours(c.getBehaviours().stream()
                    .map(this::toBehaviourDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public BehaviourDto toBehaviourDto(Behaviour b) {
        BehaviourDto dto = new BehaviourDto();
        dto.setId(b.getId());
        if (b.getCompetency() != null) {
            dto.setCompetencyId(b.getCompetency().getId());
        }
        dto.setTitle(b.getTitle());
        dto.setDescription(b.getDescription());
        dto.setSortOrder(b.getSortOrder());
        dto.setActive(b.isActive());
        return dto;
    }
}
