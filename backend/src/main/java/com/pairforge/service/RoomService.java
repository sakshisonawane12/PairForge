package com.pairforge.service;

import com.pairforge.model.Room;
import com.pairforge.model.User;
import com.pairforge.repository.RoomRepository;
import com.pairforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Room createRoom(String name, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = new Room();
        room.setRoomCode(generateUniqueRoomCode());
        room.setName(name);
        room.setCreatedBy(user);
        room.setCurrentCode("// Start coding here...");

        return roomRepository.save(room);
    }

    public Room getRoomByCode(String roomCode) {
        return roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public List<Room> getMyRooms(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return roomRepository.findByCreatedBy(user);
    }

    private String generateUniqueRoomCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (roomRepository.existsByRoomCode(code));
        return code;
    }
}