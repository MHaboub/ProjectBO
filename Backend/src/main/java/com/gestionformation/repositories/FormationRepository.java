package com.gestionformation.repositories;

import com.gestionformation.models.Formation;
import com.gestionformation.models.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByDomain(Domain domain);

    @Query("SELECT f FROM Formation f JOIN f.participants p WHERE p.id = :participantId")
    List<Formation> findByParticipantId(@Param("participantId") Long participantId);

    @Query("SELECT f FROM Formation f WHERE f.endDate < :date")
    List<Formation> findCompletedFormations(@Param("date") LocalDate date);

    @Query("SELECT f FROM Formation f WHERE f.startDate <= :date AND (f.endDate IS NULL OR f.endDate >= :date)")
    List<Formation> findCurrentFormations(@Param("date") LocalDate date);

    @Query("SELECT f FROM Formation f WHERE f.startDate > :date")
    List<Formation> findUpcomingFormations(@Param("date") LocalDate date);
}