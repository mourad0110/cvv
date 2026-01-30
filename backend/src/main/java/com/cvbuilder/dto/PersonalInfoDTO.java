package com.cvbuilder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfoDTO {
    private String firstName;
    private String lastName;
    private String photoDataUrl;
    private String headline;
    private String email;
    private String phone;
    private String location;
    private String website;
    private String linkedIn;
    private String github;
    private String summary;
}

