package com.gestionformation.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "formations")
public class Formation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private Domain domain;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private Double budget;

    private String lieu;
    private String time;

    @ManyToMany(mappedBy = "formations")
    private Set<Participant> participants = new HashSet<>();

    // Calculate duration based on start and end date
    @Transient
    public long getDurationDays() {
        if (startDate != null && endDate != null) {
            return ChronoUnit.DAYS.between(startDate, endDate);
        }
        return 0;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
        updateEndDate();
    }

    public void setDurationDays(Integer durationDays) {
        if (startDate != null && durationDays != null) {
            this.endDate = startDate.plusDays(durationDays);
        }
    }

    private void updateEndDate() {
        if (this.startDate != null && this.endDate != null) {
            if (!this.endDate.isAfter(this.startDate)) {
                this.endDate = this.startDate.plusDays(1); // Minimum 1 day duration
            }
        }
    }

    // Standard getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Domain getDomain() {
        return domain;
    }

    public void setDomain(Domain domain) {
        this.domain = domain;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
        updateEndDate();
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Set<Participant> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
    }
}
