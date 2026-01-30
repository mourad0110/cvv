package com.cvbuilder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfo {
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(columnDefinition = "TEXT")
    private String photoDataUrl;
    
    private String headline;
    
    private String email;
    
    private String phone;
    
    private String location;
    
    private String website;
    
    private String linkedIn;
    
    private String github;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
}

