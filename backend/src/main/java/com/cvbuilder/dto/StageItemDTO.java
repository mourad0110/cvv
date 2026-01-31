package com.cvbuilder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StageItemDTO {
    private Long id;
    /** Intitulé du stage */
    private String intitule;
    /** Entreprise */
    private String entreprise;
    /** Durée (ex: 3 mois, 6 mois) */
    private String duree;
    private String description;
}
