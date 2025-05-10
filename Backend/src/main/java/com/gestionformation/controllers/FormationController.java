package com.gestionformation.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gestionformation.models.Formation;
import com.gestionformation.dto.ParticipantDTO;
import com.gestionformation.services.FormationService;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/formations")
public class FormationController {
    @Autowired
    private FormationService formationService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(formationService.getAllFormations());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getAll: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFormation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(formationService.getFormation(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getFormation: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Formation formation) {
        try {
            return ResponseEntity.ok(formationService.createFormation(formation));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in create: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Formation formation) {
        try {
            Formation updatedFormation = formationService.updateFormation(id, formation);
            return ResponseEntity.ok(updatedFormation);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in update: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            formationService.deleteFormation(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in delete: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<?> getParticipants(@PathVariable Long id) {
        try {
            List<ParticipantDTO> participants = formationService.getFormationParticipantsAsDTO(id);
            return ResponseEntity.ok(participants);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getParticipants: " + e.getMessage()));
        }
    }

    @PostMapping("/{formationId}/participants/{participantId}")
    public ResponseEntity<?> addParticipant(
            @PathVariable Long formationId,
            @PathVariable Long participantId) {
        try {
            formationService.addParticipantToFormation(formationId, participantId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in addParticipant: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{formationId}/participants/{participantId}")
    public ResponseEntity<?> removeParticipant(
            @PathVariable Long formationId,
            @PathVariable Long participantId) {
        try {
            formationService.removeParticipantFromFormation(formationId, participantId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in removeParticipant: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getFormationStats() {
        try {
            Map<String, Integer> stats = new HashMap<>();
            stats.put("completed", formationService.getFormationsCompleted());
            stats.put("current", formationService.getCurrentFormations());
            stats.put("upcoming", formationService.getUpcomingFormations());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getFormationStats: " + e.getMessage()));
        }
    }

    @GetMapping("/stats/completed")
    public ResponseEntity<?> getCompletedFormationsCount() {
        try {
            return ResponseEntity.ok(formationService.getFormationsCompleted());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getCompletedFormationsCount: " + e.getMessage()));
        }
    }

    @GetMapping("/stats/current")
    public ResponseEntity<?> getCurrentFormationsCount() {
        try {
            return ResponseEntity.ok(formationService.getCurrentFormations());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getCurrentFormationsCount: " + e.getMessage()));
        }
    }

    @GetMapping("/stats/upcoming")
    public ResponseEntity<?> getUpcomingFormationsCount() {
        try {
            return ResponseEntity.ok(formationService.getUpcomingFormations());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getUpcomingFormationsCount: " + e.getMessage()));
        }
    }

    @GetMapping("/stats/monthly")
    public ResponseEntity<?> getMonthlyFormationStats(@RequestParam int month, @RequestParam int year) {
        try {
            return ResponseEntity.ok(formationService.getMonthlyFormationStats(month, year));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getMonthlyFormationStats: " + e.getMessage()));
        }
    }
}
