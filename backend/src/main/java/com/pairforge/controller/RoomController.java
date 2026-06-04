package com.pairforge.controller;

import com.pairforge.model.Room;
import com.pairforge.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(
            @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Room room = roomService.createRoom(request.name(), userDetails.getUsername());
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomCode}")
    public ResponseEntity<Room> getRoom(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getRoomByCode(roomCode));
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<Room>> getMyRooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(roomService.getMyRooms(userDetails.getUsername()));
    }

    record CreateRoomRequest(String name) {}
}