package com.paircode.service;

import com.paircode.model.CodeSnapshot;
import com.paircode.repository.CodeSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SnapshotService {

    private final CodeSnapshotRepository snapshotRepository;

    public CodeSnapshot saveSnapshot(String roomCode, String content,
                                     String language, String username) {
        CodeSnapshot snapshot = new CodeSnapshot();
        snapshot.setRoomCode(roomCode);
        snapshot.setContent(content);
        snapshot.setLanguage(language);
        snapshot.setSavedBy(username);
        return snapshotRepository.save(snapshot);
    }

    public List<CodeSnapshot> getSnapshots(String roomCode) {
        return snapshotRepository
                .findTop10ByRoomCodeOrderBySavedAtDesc(roomCode);
    }
}