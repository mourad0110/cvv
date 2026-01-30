package com.cvbuilder.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "CV Builder Backend API");
        response.put("status", "running");
        response.put("version", "1.0.0");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("GET /api/resumes", "Get all resumes");
        endpoints.put("GET /api/resumes/{id}", "Get resume by ID");
        endpoints.put("POST /api/resumes", "Create a new resume");
        endpoints.put("PUT /api/resumes/{id}", "Update a resume");
        endpoints.put("DELETE /api/resumes/{id}", "Delete a resume");
        endpoints.put("GET /health", "Health check");
        
        response.put("endpoints", endpoints);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}

