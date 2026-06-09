package com.paircode.repository;

import com.paircode.model.CodeSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodeSnapshotRepository extends JpaRepository<CodeSnapshot, Long> {
    List<CodeSnapshot> findTop10ByRoomCodeOrderBySavedAtDesc(String roomCode);
}