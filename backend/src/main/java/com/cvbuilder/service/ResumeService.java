package com.cvbuilder.service;

import com.cvbuilder.dto.ResumeDTO;
import com.cvbuilder.entity.*;
import com.cvbuilder.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResumeService {
    
    @Autowired
    private ResumeRepository resumeRepository;
    
    public ResumeDTO saveResume(ResumeDTO resumeDTO) {
        final Resume resume = resumeDTO.getId() != null
                ? resumeRepository.findById(resumeDTO.getId()).orElseGet(Resume::new)
                : new Resume();

        // Update resume fields
        resume.setTemplateId(resumeDTO.getTemplateId());
        resume.setPersonal(convertToPersonalInfo(resumeDTO.getPersonal()));
        
        // Clear existing collections
        resume.getEducation().clear();
        resume.getExperience().clear();
        resume.getStages().clear();
        resume.getSkills().clear();
        resume.getLanguages().clear();
        resume.getInterests().clear();
        
        // Add new items
        if (resumeDTO.getEducation() != null) {
            resumeDTO.getEducation().forEach(edu -> {
                EducationItem item = convertToEducationItem(edu);
                item.setResume(resume);
                resume.getEducation().add(item);
            });
        }
        
        if (resumeDTO.getExperience() != null) {
            resumeDTO.getExperience().forEach(exp -> {
                ExperienceItem item = convertToExperienceItem(exp);
                item.setResume(resume);
                resume.getExperience().add(item);
            });
        }

        if (resumeDTO.getStages() != null) {
            resumeDTO.getStages().forEach(st -> {
                StageItem item = convertToStageItem(st);
                item.setResume(resume);
                resume.getStages().add(item);
            });
        }
        
        if (resumeDTO.getSkills() != null) {
            resumeDTO.getSkills().forEach(skill -> {
                SkillItem item = convertToSkillItem(skill);
                item.setResume(resume);
                resume.getSkills().add(item);
            });
        }
        
        if (resumeDTO.getLanguages() != null) {
            resumeDTO.getLanguages().forEach(lang -> {
                LanguageItem item = convertToLanguageItem(lang);
                item.setResume(resume);
                resume.getLanguages().add(item);
            });
        }
        
        if (resumeDTO.getInterests() != null) {
            resume.getInterests().addAll(resumeDTO.getInterests());
        }
        
        Resume saved = resumeRepository.save(resume);
        return convertToDTO(saved);
    }
    
    @Transactional(readOnly = true)
    public ResumeDTO getResume(Long id) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        return convertToDTO(resume);
    }
    
    @Transactional(readOnly = true)
    public List<ResumeDTO> getAllResumes() {
        return resumeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }
    
    // Conversion methods
    private PersonalInfo convertToPersonalInfo(com.cvbuilder.dto.PersonalInfoDTO dto) {
        if (dto == null) return null;
        return new PersonalInfo(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getPhotoDataUrl(),
                dto.getHeadline(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getLocation(),
                dto.getWebsite(),
                dto.getLinkedIn(),
                dto.getGithub(),
                dto.getSummary()
        );
    }
    
    private EducationItem convertToEducationItem(com.cvbuilder.dto.EducationItemDTO dto) {
        EducationItem item = new EducationItem();
        item.setId(dto.getId());
        item.setSchool(dto.getSchool());
        item.setDegree(dto.getDegree());
        item.setField(dto.getField());
        item.setLocation(dto.getLocation());
        item.setStartDate(dto.getStartDate());
        item.setEndDate(dto.getEndDate());
        item.setDescription(dto.getDescription());
        return item;
    }
    
    private ExperienceItem convertToExperienceItem(com.cvbuilder.dto.ExperienceItemDTO dto) {
        ExperienceItem item = new ExperienceItem();
        item.setId(dto.getId());
        item.setCompany(dto.getCompany());
        item.setRole(dto.getRole());
        item.setLocation(dto.getLocation());
        item.setStartDate(dto.getStartDate());
        item.setEndDate(dto.getEndDate());
        item.setDescription(dto.getDescription());
        if (dto.getHighlights() != null) {
            item.getHighlights().addAll(dto.getHighlights());
        }
        return item;
    }
    
    private SkillItem convertToSkillItem(com.cvbuilder.dto.SkillItemDTO dto) {
        SkillItem item = new SkillItem();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setLevel(dto.getLevel());
        return item;
    }
    
    private LanguageItem convertToLanguageItem(com.cvbuilder.dto.LanguageItemDTO dto) {
        LanguageItem item = new LanguageItem();
        item.setId(dto.getId());
        item.setName(dto.getName());
        item.setLevel(dto.getLevel());
        return item;
    }
    
    private ResumeDTO convertToDTO(Resume resume) {
        ResumeDTO dto = new ResumeDTO();
        dto.setId(resume.getId());
        dto.setTemplateId(resume.getTemplateId());
        dto.setPersonal(convertToPersonalInfoDTO(resume.getPersonal()));
        dto.setEducation(resume.getEducation().stream()
                .map(this::convertToEducationItemDTO)
                .collect(Collectors.toList()));
        dto.setExperience(resume.getExperience().stream()
                .map(this::convertToExperienceItemDTO)
                .collect(Collectors.toList()));
        dto.setStages(resume.getStages().stream()
                .map(this::convertToStageItemDTO)
                .collect(Collectors.toList()));
        dto.setSkills(resume.getSkills().stream()
                .map(this::convertToSkillItemDTO)
                .collect(Collectors.toList()));
        dto.setLanguages(resume.getLanguages().stream()
                .map(this::convertToLanguageItemDTO)
                .collect(Collectors.toList()));
        dto.setInterests(new ArrayList<>(resume.getInterests()));
        dto.setUpdatedAt(resume.getUpdatedAt());
        return dto;
    }
    
    private com.cvbuilder.dto.PersonalInfoDTO convertToPersonalInfoDTO(PersonalInfo info) {
        if (info == null) return null;
        return new com.cvbuilder.dto.PersonalInfoDTO(
                info.getFirstName(),
                info.getLastName(),
                info.getPhotoDataUrl(),
                info.getHeadline(),
                info.getEmail(),
                info.getPhone(),
                info.getLocation(),
                info.getWebsite(),
                info.getLinkedIn(),
                info.getGithub(),
                info.getSummary()
        );
    }
    
    private com.cvbuilder.dto.EducationItemDTO convertToEducationItemDTO(EducationItem item) {
        com.cvbuilder.dto.EducationItemDTO dto = new com.cvbuilder.dto.EducationItemDTO();
        dto.setId(item.getId());
        dto.setSchool(item.getSchool());
        dto.setDegree(item.getDegree());
        dto.setField(item.getField());
        dto.setLocation(item.getLocation());
        dto.setStartDate(item.getStartDate());
        dto.setEndDate(item.getEndDate());
        dto.setDescription(item.getDescription());
        return dto;
    }
    
    private com.cvbuilder.dto.ExperienceItemDTO convertToExperienceItemDTO(ExperienceItem item) {
        com.cvbuilder.dto.ExperienceItemDTO dto = new com.cvbuilder.dto.ExperienceItemDTO();
        dto.setId(item.getId());
        dto.setCompany(item.getCompany());
        dto.setRole(item.getRole());
        dto.setLocation(item.getLocation());
        dto.setStartDate(item.getStartDate());
        dto.setEndDate(item.getEndDate());
        dto.setDescription(item.getDescription());
        if (item.getHighlights() != null) {
            dto.getHighlights().addAll(item.getHighlights());
        }
        return dto;
    }

    private StageItem convertToStageItem(com.cvbuilder.dto.StageItemDTO dto) {
        StageItem item = new StageItem();
        item.setId(dto.getId());
        item.setIntitule(dto.getIntitule());
        item.setEntreprise(dto.getEntreprise());
        item.setDuree(dto.getDuree());
        item.setDescription(dto.getDescription());
        return item;
    }

    private com.cvbuilder.dto.StageItemDTO convertToStageItemDTO(StageItem item) {
        com.cvbuilder.dto.StageItemDTO dto = new com.cvbuilder.dto.StageItemDTO();
        dto.setId(item.getId());
        dto.setIntitule(item.getIntitule());
        dto.setEntreprise(item.getEntreprise());
        dto.setDuree(item.getDuree());
        dto.setDescription(item.getDescription());
        return dto;
    }
    
    private com.cvbuilder.dto.SkillItemDTO convertToSkillItemDTO(SkillItem item) {
        com.cvbuilder.dto.SkillItemDTO dto = new com.cvbuilder.dto.SkillItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setLevel(item.getLevel());
        return dto;
    }
    
    private com.cvbuilder.dto.LanguageItemDTO convertToLanguageItemDTO(LanguageItem item) {
        com.cvbuilder.dto.LanguageItemDTO dto = new com.cvbuilder.dto.LanguageItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setLevel(item.getLevel());
        return dto;
    }
}

