package com.gestionformation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.gestionformation.models.Participant;
import com.gestionformation.models.Profile;
import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Participant findByIdAndDeletedFalse(Long id);

    @Query("SELECT p FROM Participant p JOIN p.formations f WHERE f.id = :formationId AND p.deleted = false")
    List<Participant> findByFormationId(@Param("formationId") Long formationId);

    @Query("SELECT p FROM Participant p WHERE p.email = :email AND p.deleted = false")
    Participant findByEmail(@Param("email") String email);

    List<Participant> findByDeletedFalse();

    @Query("SELECT p FROM Participant p")
    List<Participant> findAll();

    @Query("SELECT p FROM Participant p WHERE p.firstName = :firstName AND p.deleted = false")
    List<Participant> findByFirstName(@Param("firstName") String firstName);

    List<Participant> findByProfileAndDeletedFalse(Profile profile);

    @Query("SELECT COUNT(p) FROM Participant p WHERE p.profile = :profile AND p.deleted = false")
    long countByProfile(@Param("profile") Profile profile);
}
