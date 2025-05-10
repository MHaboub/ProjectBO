package com.gestionformation.controllers;

import com.gestionformation.services.FormationService;
import com.gestionformation.services.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @Autowired
    private FormationService formationService;

    @Autowired
    private ParticipantService participantService;

    @GetMapping("/")
    public String home() {
        return "Welcome to the Formation Management System API";
    }

    @GetMapping("/api/stats")
    public ResponseEntity<?> getStats() {
        try {
            Map<String, Integer> stats = new HashMap<>();
            stats.put("formations", formationService.getAllFormations().size());
            stats.put("formateurs", 0);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error in getStats: " + e.getMessage()));
        }
    }
}
