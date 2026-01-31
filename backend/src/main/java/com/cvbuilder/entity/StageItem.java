package com.cvbuilder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stage_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StageItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    /** Intitulé du stage */
    @Column(nullable = false)
    private String intitule;

    /** Entreprise */
    @Column(nullable = false)
    private String entreprise;

    /** Durée (ex: 3 mois, 6 mois) */
    private String duree;

    @Column(columnDefinition = "TEXT")
    private String description;
}
