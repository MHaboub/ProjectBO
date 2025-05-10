package com.gestionformation.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.gestionformation.models.Participant;
import com.gestionformation.models.Profile;
import com.gestionformation.models.Formation;
import com.gestionformation.repositories.ParticipantRepository;
import com.gestionformation.repositories.FormationRepository;
import com.gestionformation.dto.ParticipantDTO;
import com.gestionformation.dto.FormationDTO;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private FormationRepository formationRepository;

    public List<ParticipantDTO> getAllParticipants() {
        return participantRepository.findByDeletedFalse()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ParticipantDTO getParticipant(Long id) {
        Participant participant = participantRepository.findByIdAndDeletedFalse(id);
        return participant != null ? convertToDTO(participant) : null;
    }

    public ParticipantDTO addParticipant(ParticipantDTO participantDTO) {
        validateParticipant(participantDTO);
        Participant participant = convertToEntity(participantDTO);
        participant.setDeleted(false);
        return convertToDTO(participantRepository.save(participant));
    }

    public ParticipantDTO updateParticipant(Long id, ParticipantDTO participantDTO) {
        Participant existingParticipant = participantRepository.findByIdAndDeletedFalse(id);
        if (existingParticipant == null) {
            throw new IllegalArgumentException("Participant not found");
        }

        validateParticipant(participantDTO);

        existingParticipant.setFirstName(participantDTO.getFirstName());
        existingParticipant.setLastName(participantDTO.getLastName());
        existingParticipant.setEmail(participantDTO.getEmail());
        existingParticipant.setTelephone(participantDTO.getTelephone());
        existingParticipant.setStructure(participantDTO.getStructure());
        existingParticipant.setProfile(participantDTO.getProfile());

        return convertToDTO(participantRepository.save(existingParticipant));
    }

    public void deleteParticipant(Long id) {
        Participant participant = participantRepository.findByIdAndDeletedFalse(id);
        if (participant != null) {
            participant.setDeleted(true);
            participantRepository.save(participant);
        }
    }

    // Formation-related operations remain unchanged
    public List<Formation> getParticipantFormations(Long participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        return new ArrayList<>(participant.getFormations());
    }

    public void addFormationToParticipant(Long participantId, Long formationId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new IllegalArgumentException("Formation not found"));

        participant.addFormation(formation);
        participantRepository.save(participant);
    }

    public void removeFormationFromParticipant(Long participantId, Long formationId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new IllegalArgumentException("Formation not found"));

        participant.removeFormation(formation);
        participantRepository.save(participant);
    }

    public List<ParticipantDTO> findParticipantsByFormationId(Long formationId) {
        return participantRepository.findByFormationId(formationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FormationDTO> getParticipantFormationsAsDTO(Long participantId) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));
        return participant.getFormations().stream()
                .map(this::convertToFormationDTO)
                .collect(Collectors.toList());
    }

    private FormationDTO convertToFormationDTO(Formation formation) {
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

    private ParticipantDTO convertToDTO(Participant participant) {
        return new ParticipantDTO(
                participant.getId(),
                participant.getFirstName(),
                participant.getLastName(),
                participant.getEmail(),
                participant.getTelephone(),
                participant.getStructure(),
                participant.getProfile());
    }

    private Participant convertToEntity(ParticipantDTO dto) {
        Participant participant = new Participant();
        participant.setId(dto.getId());
        participant.setFirstName(dto.getFirstName());
        participant.setLastName(dto.getLastName());
        participant.setEmail(dto.getEmail());
        participant.setTelephone(dto.getTelephone());
        participant.setStructure(dto.getStructure());
        participant.setProfile(dto.getProfile());
        return participant;
    }

    private void validateParticipant(ParticipantDTO participant) {
        if (participant.getFirstName() == null || participant.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (participant.getLastName() == null || participant.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (participant.getEmail() == null || participant.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        // Additional validation could be added here (email format, phone format, etc.)
    }

    public List<ParticipantDTO> getParticipantsByProfile(Profile profile) {
        return participantRepository.findByProfileAndDeletedFalse(profile)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public long getParticipantCountByProfile(Profile profile) {
        return participantRepository.countByProfile(profile);
    }

    public List<ParticipantDTO> getParticipantsWithProfileParticipant() {
        return getParticipantsByProfile(Profile.Participant);
    }

    public long getParticipantCountWithProfileParticipant() {
        return getParticipantCountByProfile(Profile.Participant);
    }

    public List<ParticipantDTO> getParticipantsWithProfileIntern() {
        return getParticipantsByProfile(Profile.Intern);
    }

    public long getParticipantCountWithProfileIntern() {
        return getParticipantCountByProfile(Profile.Intern);
    }

    public List<ParticipantDTO> getParticipantsWithProfileExtern() {
        return getParticipantsByProfile(Profile.Extern);
    }

    public long getParticipantCountWithProfileExtern() {
        return getParticipantCountByProfile(Profile.Extern);
    }
}
