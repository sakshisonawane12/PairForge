package com.paircode.repository;

import com.paircode.model.RoomFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoomFileRepository extends JpaRepository<RoomFile, Long> {
    List<RoomFile> findByRoomCodeOrderByCreatedAtAsc(String roomCode);
    Optional<RoomFile> findByRoomCodeAndFileName(String roomCode, String fileName);
    boolean existsByRoomCodeAndFileName(String roomCode, String fileName);
}