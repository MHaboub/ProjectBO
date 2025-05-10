package com.gestionformation.services;

import com.gestionformation.models.*;
import com.gestionformation.repositories.*;
import com.gestionformation.dto.FormationDTO;
import com.gestionformation.dto.ParticipantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.function.Supplier;

@Service
@Transactional
public class FormationService {

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    public FormationDTO createFormation(Formation formation) {
        if (formation.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }
        if (formation.getTitle() == null || formation.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (formation.getBudget() == null || formation.getBudget() <= 0) {
            throw new IllegalArgumentException("Valid budget is required");
        }
        Formation savedFormation = formationRepository.save(formation);
        return convertToDTO(savedFormation);
    }

    public List<FormationDTO> getAllFormations() {
        List<Formation> formations = formationRepository.findAll();
        return formations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FormationDTO getFormation(Long id) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Formation not found"));
        return convertToDTO(formation);
    }

    public Formation updateFormation(Long id, Formation formationDetails) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Formation not found"));

        formation.setTitle(formationDetails.getTitle());
        formation.setDomain(formationDetails.getDomain());
        formation.setStartDate(formationDetails.getStartDate());
        formation.setEndDate(formationDetails.getEndDate());
        formation.setBudget(formationDetails.getBudget());
        formation.setLieu(formationDetails.getLieu());
        formation.setTime(formationDetails.getTime());

        return formationRepository.save(formation);
    }

    public void deleteFormation(Long id) {
        formationRepository.deleteById(id);
    }

    public List<Participant> getFormationParticipants(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Formation not found"));
        return new ArrayList<>(formation.getParticipants());
    }

    public List<ParticipantDTO> getFormationParticipantsAsDTO(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Formation not found"));
        return formation.getParticipants().stream()
                .map(this::convertToParticipantDTO)
                .collect(Collectors.toList());
    }

    public void addParticipantToFormation(Long formationId, Long participantId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Formation not found"));
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Participant not found"));

        participant.addFormation(formation);
        participantRepository.save(participant);
    }

    public void removeParticipantFromFormation(Long formationId, Long participantId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Formation not found"));
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow((Supplier<RuntimeException>) () -> new EntityNotFoundException("Participant not found"));

        participant.removeFormation(formation);
        participantRepository.save(participant);
    }

    public int getFormationsCompleted() {
        LocalDate today = LocalDate.now();
        System.out.println("Today: " + today);
        System.out.println("Formations: " + (int) formationRepository.findAll().stream()
                .filter(formation -> formation.getEndDate() != null && formation.getEndDate().isBefore(today))
                .count());
        return (int) formationRepository.findAll().stream()
                .filter(formation -> formation.getEndDate() != null && formation.getEndDate().isBefore(today))
                .count();
    }

    public int getCurrentFormations() {
        LocalDate today = LocalDate.now();
        return (int) formationRepository.findAll().stream()
                .filter(formation -> formation.getStartDate().isBefore(today) &&
                        (formation.getEndDate() == null || formation.getEndDate().isAfter(today)))
                .count();
    }

    public int getUpcomingFormations() {
        LocalDate today = LocalDate.now();
        return (int) formationRepository.findAll().stream()
                .filter(formation -> formation.getStartDate().isAfter(today))
                .count();
    }

    private FormationDTO convertToDTO(Formation formation) {
        FormationDTO dto = new FormationDTO();
        dto.setId(formation.getId());
        dto.setTitle(formation.getTitle());
        dto.setDomain(formation.getDomain());
        dto.setStartDate(formation.getStartDate());
        dto.setEndDate(formation.getEndDate());
        dto.setBudget(formation.getBudget());
        dto.setLieu(formation.getLieu());
        dto.setTime(formation.getTime());
        dto.setDurationDays(formation.getDurationDays());
        return dto;
    }

    private ParticipantDTO convertToParticipantDTO(Participant participant) {
        return new ParticipantDTO(
                participant.getId(),
                participant.getFirstName(),
                participant.getLastName(),
                participant.getEmail(),
                participant.getTelephone(),
                participant.getStructure(),
                participant.getProfile());
    }

    public Map<String, Integer> getMonthlyFormationStats(int month, int year) {
        List<Formation> formationsInMonth = formationRepository.findAll().stream()
                .filter(f -> f.getStartDate() != null &&
                        f.getStartDate().getMonthValue() == month &&
                        f.getStartDate().getYear() == year)
                .toList();

        int formationCount = formationsInMonth.size();
        int totalParticipants = formationsInMonth.stream()
                .mapToInt(f -> f.getParticipants() != null ? f.getParticipants().size() : 0)
                .sum();

        Map<String, Integer> stats = new HashMap<>();
        stats.put("formationCount", formationCount);
        stats.put("totalParticipants", totalParticipants);
        return stats;
    }
}
