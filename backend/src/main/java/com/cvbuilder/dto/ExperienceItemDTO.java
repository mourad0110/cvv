package com.cvbuilder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceItemDTO {
    private Long id;
    private String company;
    private String role;
    private String location;
    private String startDate;
    private String endDate;
    private String description;
    private List<String> highlights = new ArrayList<>();
}

