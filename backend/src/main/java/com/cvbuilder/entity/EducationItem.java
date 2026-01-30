package com.cvbuilder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "education_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EducationItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;
    
    @Column(nullable = false)
    private String school;
    
    private String degree;
    
    private String field;
    
    private String location;
    
    private String startDate;
    
    private String endDate;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}

