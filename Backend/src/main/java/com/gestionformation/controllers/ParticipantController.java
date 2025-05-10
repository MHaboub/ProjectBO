package com.gestionformation.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gestionformation.services.ParticipantService;
import com.gestionformation.dto.ParticipantDTO;
import com.gestionformation.dto.FormationDTO;
import com.gestionformation.models.Profile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    private ParticipantService participantService;

    @GetMapping
    public ResponseEntity<?> getAllParticipants() {
        try {
            List<ParticipantDTO> participants = participantService.getAllParticipants();
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getAllParticipants: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getParticipant(@PathVariable Long id) {
        try {
            ParticipantDTO participant = participantService.getParticipant(id);
            if (participant != null) {
                return ResponseEntity.ok(participant);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getParticipant: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/{profile}")
    public ResponseEntity<?> getParticipantsByProfile(@PathVariable String profile) {
        try {
            Profile prof = Profile.valueOf(profile);
            List<ParticipantDTO> participants = participantService.getParticipantsByProfile(prof);
            return ResponseEntity.ok(participants);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid profile: " + profile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getParticipantsByProfile: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/{profile}/count")
    public ResponseEntity<?> getParticipantCountByProfile(@PathVariable String profile) {
        try {
            Profile prof = Profile.valueOf(profile);
            long count = participantService.getParticipantCountByProfile(prof);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid profile: " + profile));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getParticipantCountByProfile: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/participant")
    public ResponseEntity<?> getParticipantsWithProfileParticipant() {
        try {
            List<ParticipantDTO> participants = participantService.getParticipantsWithProfileParticipant();
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Internal Server Error in getParticipantsWithProfileParticipant: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/participant/count")
    public ResponseEntity<?> getParticipantCountWithProfileParticipant() {
        try {
            long count = participantService.getParticipantCountWithProfileParticipant();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Internal Server Error in getParticipantCountWithProfileParticipant: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/intern")
    public ResponseEntity<?> getParticipantsWithProfileIntern() {
        try {
            List<ParticipantDTO> participants = participantService.getParticipantsWithProfileIntern();
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Internal Server Error in getParticipantsWithProfileIntern: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/intern/count")
    public ResponseEntity<?> getParticipantCountWithProfileIntern() {
        try {
            long count = participantService.getParticipantCountWithProfileIntern();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Internal Server Error in getParticipantCountWithProfileIntern: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/extern")
    public ResponseEntity<?> getParticipantsWithProfileExtern() {
        try {
            List<ParticipantDTO> participants = participantService.getParticipantsWithProfileExtern();
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Internal Server Error in getParticipantsWithProfileExtern: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/extern/count")
    public ResponseEntity<?> getParticipantCountWithProfileExtern() {
        try {
            long count = participantService.getParticipantCountWithProfileExtern();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Internal Server Error in getParticipantCountWithProfileExtern: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createParticipant(@RequestBody ParticipantDTO participantDTO) {
        try {
            ParticipantDTO createdParticipant = participantService.addParticipant(participantDTO);
            return ResponseEntity.ok(createdParticipant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in createParticipant: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateParticipant(
            @PathVariable Long id,
            @RequestBody ParticipantDTO participantDTO) {
        try {
            ParticipantDTO updatedParticipant = participantService.updateParticipant(id, participantDTO);
            return ResponseEntity.ok(updatedParticipant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in updateParticipant: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParticipant(@PathVariable Long id) {
        try {
            participantService.deleteParticipant(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in deleteParticipant: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/formations")
    public ResponseEntity<?> getParticipantFormations(@PathVariable Long id) {
        try {
            List<FormationDTO> formations = participantService.getParticipantFormationsAsDTO(id);
            return ResponseEntity.ok(formations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getParticipantFormations: " + e.getMessage()));
        }
    }

    @PostMapping("/{participantId}/formations/{formationId}")
    public ResponseEntity<?> addFormation(
            @PathVariable Long participantId,
            @PathVariable Long formationId) {
        try {
            participantService.addFormationToParticipant(participantId, formationId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in addFormation: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{participantId}/formations/{formationId}")
    public ResponseEntity<?> removeFormation(
            @PathVariable Long participantId,
            @PathVariable Long formationId) {
        try {
            participantService.removeFormationFromParticipant(participantId, formationId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in removeFormation: " + e.getMessage()));
        }
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<?> getParticipantsByFormation(@PathVariable Long formationId) {
        try {
            List<ParticipantDTO> participants = participantService.findParticipantsByFormationId(formationId);
            if (!participants.isEmpty()) {
                return ResponseEntity.ok(participants);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getParticipantsByFormation: " + e.getMessage()));
        }
    }
}
