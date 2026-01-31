package com.cvbuilder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDTO {
    private Long id;
    private String templateId;
    private PersonalInfoDTO personal;
    private List<EducationItemDTO> education = new ArrayList<>();
    private List<ExperienceItemDTO> experience = new ArrayList<>();
    private List<StageItemDTO> stages = new ArrayList<>();
    private List<SkillItemDTO> skills = new ArrayList<>();
    private List<LanguageItemDTO> languages = new ArrayList<>();
    private List<String> interests = new ArrayList<>();
    private LocalDateTime updatedAt;
}

