package com.paircode.repository;

import com.paircode.model.Room;
import com.paircode.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomCode(String roomCode);
    List<Room> findByCreatedBy(User user);
    boolean existsByRoomCode(String roomCode);
    List<Room> findAllByOrderByCreatedAtDesc();
}