package com.paircode.service;

import com.paircode.model.RoomFile;
import com.paircode.repository.RoomFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomFileService {

    private final RoomFileRepository roomFileRepository;

    public RoomFile createFile(String roomCode, String fileName, String language) {
        if (roomFileRepository.existsByRoomCodeAndFileName(roomCode, fileName)) {
            throw new RuntimeException("File already exists: " + fileName);
        }
        RoomFile file = new RoomFile();
        file.setRoomCode(roomCode);
        file.setFileName(fileName);
        file.setLanguage(language);
        file.setContent(getDefaultContent(language));
        return roomFileRepository.save(file);
    }

    public List<RoomFile> getFiles(String roomCode) {
        return roomFileRepository.findByRoomCodeOrderByCreatedAtAsc(roomCode);
    }

    public RoomFile updateFile(String roomCode, String fileName, String content) {
        RoomFile file = roomFileRepository
                .findByRoomCodeAndFileName(roomCode, fileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
        file.setContent(content);
        return roomFileRepository.save(file);
    }

    public void deleteFile(String roomCode, String fileName) {
        RoomFile file = roomFileRepository
                .findByRoomCodeAndFileName(roomCode, fileName)
                .orElseThrow(() -> new RuntimeException("File not found"));
        roomFileRepository.delete(file);
    }

    private String getDefaultContent(String language) {
        switch (language) {
            case "python":     return "# " + "New file\n";
            case "java":       return "// New file\npublic class Solution {\n    \n}\n";
            case "cpp":        return "// New file\n#include<iostream>\nusing namespace std;\n\n";
            default:           return "// New file\n";
        }
    }
}