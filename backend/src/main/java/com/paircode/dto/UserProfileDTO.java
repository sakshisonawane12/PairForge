package com.paircode.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String displayName;
    private int roomsCreated;
}