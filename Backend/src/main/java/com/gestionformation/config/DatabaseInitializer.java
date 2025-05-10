package com.gestionformation.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.gestionformation.models.*;
import com.gestionformation.repositories.*;
import java.time.LocalDate;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FormationRepository formationRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user exists
        if (userRepository.findByUsername("admin") == null) {
            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(Role.ADMIN);
            admin.setDeleted(false);
            userRepository.save(admin);

            // Create sample users
            createUser("sarah_m", "Sarah", "Miller", Role.MANAGER);
            createUser("john_doe", "John", "Doe", Role.USER);
            createUser("maria_g", "Maria", "Garcia", Role.ADMIN);
        }

        // Create formations if they don't exist
        if (formationRepository.count() == 0) {
            createFormation("Spring Boot Advanced", Domain.IT,
                    LocalDate.of(2025, 5, 1), LocalDate.of(2025, 5, 15),
                    2500.00, "Online", "Full-time");

            createFormation("Data Science Fundamentals", Domain.IT,
                    LocalDate.of(2025, 6, 1), LocalDate.of(2025, 6, 30),
                    3000.00, "Paris", "Part-time");

            createFormation("Cloud Architecture", Domain.IT,
                    LocalDate.of(2025, 7, 1), LocalDate.of(2025, 7, 15),
                    2800.00, "London", "Full-time");
        }

        // Create participants if they don't exist
        if (participantRepository.count() == 0) {
            createParticipant("Jean", "Dupont", "jean.dupont@email.com",
                    "+33123456789", Structure.IT, Profile.Participant);

            createParticipant("Marie", "Laurent", "marie.laurent@email.com",
                    "+33234567890", Structure.Finance, Profile.Intern);

            createParticipant("Pierre", "Martin", "pierre.martin@email.com",
                    "+33345678901", Structure.Marketing, Profile.Extern);
        }
    }

    private void createUser(String username, String firstName, String lastName, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setDeleted(false);
        userRepository.save(user);
    }

    private void createFormation(String title, Domain domain, LocalDate startDate,
            LocalDate endDate, Double budget, String lieu, String time) {
        Formation formation = new Formation();
        formation.setTitle(title);
        formation.setDomain(domain);
        formation.setStartDate(startDate);
        formation.setEndDate(endDate);
        formation.setBudget(budget);
        formation.setLieu(lieu);
        formation.setTime(time);
        formationRepository.save(formation);
    }

    private void createParticipant(String firstName, String lastName, String email,
            String telephone, Structure structure, Profile profile) {
        Participant participant = new Participant();
        participant.setFirstName(firstName);
        participant.setLastName(lastName);
        participant.setEmail(email);
        participant.setTelephone(telephone);
        participant.setStructure(structure);
        participant.setProfile(profile);
        participant.setDeleted(false);
        participantRepository.save(participant);
    }
}