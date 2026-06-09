package com.paircode.service;

import com.paircode.dto.UserProfileDTO;
import com.paircode.model.User;
import com.paircode.repository.RoomRepository;
import com.paircode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public UserProfileDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setDisplayName(user.getDisplayName() != null
                ? user.getDisplayName() : user.getUsername());
        dto.setRoomsCreated(roomRepository.findByCreatedBy(user).size());
        return dto;
    }

    public UserProfileDTO updateProfile(String username, Map<String, String> updates) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("bio"))
            user.setBio(updates.get("bio"));
        if (updates.containsKey("avatarUrl"))
            user.setAvatarUrl(updates.get("avatarUrl"));
        if (updates.containsKey("displayName"))
            user.setDisplayName(updates.get("displayName"));

        userRepository.save(user);
        return getProfile(username);
    }
}