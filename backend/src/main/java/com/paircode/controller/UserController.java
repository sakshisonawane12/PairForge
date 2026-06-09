package com.paircode.controller;

import com.paircode.dto.UserProfileDTO;
import com.paircode.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                userService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(
                userService.updateProfile(userDetails.getUsername(), updates));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfile(
            @PathVariable String username) {
        return ResponseEntity.ok(userService.getProfile(username));
    }
}