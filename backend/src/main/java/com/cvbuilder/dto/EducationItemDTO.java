package com.cvbuilder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EducationItemDTO {
    private Long id;
    private String school;
    private String degree;
    private String field;
    private String location;
    private String startDate;
    private String endDate;
    private String description;
}

