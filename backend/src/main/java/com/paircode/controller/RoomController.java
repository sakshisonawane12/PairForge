package com.paircode.controller;

import com.paircode.model.Room;
import com.paircode.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.paircode.service.ChatService;
import com.paircode.model.ChatMessage;
import java.util.Map;


@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final ChatService chatService;

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(
            @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Room room = roomService.createRoom(
                request.name(), userDetails.getUsername(), request.password());
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{roomCode}/verify")
    public ResponseEntity<Map<String, Boolean>> verifyPassword(
            @PathVariable String roomCode,
            @RequestBody Map<String, String> body) {
        boolean valid = roomService.verifyRoomPassword(
                roomCode, body.get("password"));
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<Room>> getMyRooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roomService.getMyRooms(userDetails.getUsername()));
    }
    @GetMapping("/{roomCode}")
    public ResponseEntity<Room> getRoom(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomByCode(roomCode));
    }
    @GetMapping("/{roomCode}/messages")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable String roomCode) {
        return ResponseEntity.ok(chatService.getLast50Messages(roomCode));
    }

    record CreateRoomRequest(String name, String password) {}
}