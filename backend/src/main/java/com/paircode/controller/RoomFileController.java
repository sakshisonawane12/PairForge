package com.paircode.controller;

import com.paircode.model.RoomFile;
import com.paircode.service.RoomFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms/{roomCode}/files")
@RequiredArgsConstructor
public class RoomFileController {

    private final RoomFileService roomFileService;

    @GetMapping
    public ResponseEntity<List<RoomFile>> getFiles(
            @PathVariable String roomCode) {
        return ResponseEntity.ok(roomFileService.getFiles(roomCode));
    }

    @PostMapping
    public ResponseEntity<RoomFile> createFile(
            @PathVariable String roomCode,
            @RequestBody Map<String, String> body) {
        RoomFile file = roomFileService.createFile(
                roomCode,
                body.get("fileName"),
                body.getOrDefault("language", "javascript")
        );
        return ResponseEntity.ok(file);
    }

    @PutMapping("/{fileName}")
    public ResponseEntity<RoomFile> updateFile(
            @PathVariable String roomCode,
            @PathVariable String fileName,
            @RequestBody Map<String, String> body) {
        RoomFile file = roomFileService.updateFile(
                roomCode, fileName, body.get("content"));
        return ResponseEntity.ok(file);
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String roomCode,
            @PathVariable String fileName) {
        roomFileService.deleteFile(roomCode, fileName);
        return ResponseEntity.ok().build();
    }
}