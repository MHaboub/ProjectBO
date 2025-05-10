package com.gestionformation.dto;

import com.gestionformation.models.Domain;
import java.time.LocalDate;

public class FormationDTO {
    private Long id;
    private String title;
    private Domain domain;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double budget;
    private String lieu;
    private String time;
    private long durationDays;

    public FormationDTO() {
    }

    public FormationDTO(Long id, String title, Domain domain, LocalDate startDate, LocalDate endDate, Double budget,
            String lieu, String time) {
        this.id = id;
        this.title = title;
        this.domain = domain;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.lieu = lieu;
        this.time = time;
    }

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

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
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

    public long getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(long durationDays) {
        this.durationDays = durationDays;
    }
}
