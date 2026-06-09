package com.paircode.service;

import com.paircode.model.Room;
import com.paircode.model.User;
import com.paircode.repository.RoomRepository;
import com.paircode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Room createRoom(String name, String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = new Room();
        room.setRoomCode(generateUniqueRoomCode());
        room.setName(name);
        room.setCreatedBy(user);
        room.setCurrentCode("// Start coding here...");

        if (password != null && !password.isEmpty()) {
            room.setPassword(password);
            room.setPrivate(true);
        }

        return roomRepository.save(room);
    }
    public boolean verifyRoomPassword(String roomCode, String password) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (!room.isPrivate()) return true;
        return password != null && password.equals(room.getPassword());
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
    public void updateRoomCode(String roomCode, String content) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setCurrentCode(content);
        roomRepository.save(room);
    }
    private String generateUniqueRoomCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (roomRepository.existsByRoomCode(code));
        return code;


    }
}