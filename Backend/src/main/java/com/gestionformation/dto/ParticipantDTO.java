package com.gestionformation.dto;

import com.gestionformation.models.Profile;
import com.gestionformation.models.Structure;

public class ParticipantDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String telephone;
    private Structure structure;
    private Profile profile;

    public ParticipantDTO() {
    }

    public ParticipantDTO(Long id, String firstName, String lastName, String email,
            String telephone, Structure structure, Profile profile) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        this.structure = structure;
        this.profile = profile;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Structure getStructure() {
        return structure;
    }

    public void setStructure(Structure structure) {
        this.structure = structure;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
}