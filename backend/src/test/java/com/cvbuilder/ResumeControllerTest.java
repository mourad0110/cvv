package com.cvbuilder;

import com.cvbuilder.dto.ResumeDTO;
import com.cvbuilder.dto.PersonalInfoDTO;
import com.cvbuilder.repository.ResumeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
public class ResumeControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @Test
    public void testCreateResume() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        ResumeDTO resumeDTO = new ResumeDTO();
        resumeDTO.setTemplateId("atlas");
        
        PersonalInfoDTO personal = new PersonalInfoDTO();
        personal.setFirstName("Test");
        personal.setLastName("User");
        personal.setEmail("test@example.com");
        resumeDTO.setPersonal(personal);
        
        resumeDTO.setEducation(new ArrayList<>());
        resumeDTO.setExperience(new ArrayList<>());
        resumeDTO.setSkills(new ArrayList<>());
        resumeDTO.setLanguages(new ArrayList<>());
        resumeDTO.setInterests(new ArrayList<>());

        mockMvc.perform(post("/api/resumes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resumeDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.templateId").value("atlas"))
                .andExpect(jsonPath("$.personal.firstName").value("Test"));
    }

    @Test
    public void testGetAllResumes() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}

