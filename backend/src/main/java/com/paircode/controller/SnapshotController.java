package com.paircode.controller;

import com.paircode.model.CodeSnapshot;
import com.paircode.service.SnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class SnapshotController {

    private final SnapshotService snapshotService;

    @PostMapping("/{roomCode}/snapshot")
    public ResponseEntity<CodeSnapshot> saveSnapshot(
            @PathVariable String roomCode,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        CodeSnapshot snapshot = snapshotService.saveSnapshot(
                roomCode,
                body.get("content"),
                body.get("language"),
                userDetails.getUsername()
        );
        return ResponseEntity.ok(snapshot);
    }

    @GetMapping("/{roomCode}/snapshots")
    public ResponseEntity<List<CodeSnapshot>> getSnapshots(
            @PathVariable String roomCode) {
        return ResponseEntity.ok(snapshotService.getSnapshots(roomCode));
    }
}