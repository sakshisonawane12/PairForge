package com.pairforge.controller;

import com.pairforge.config.RedisMessagePublisher;
import com.pairforge.dto.CodeChangeMessage;
import com.pairforge.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class CodeWebSocketController {

    private final RedisMessagePublisher publisher;
    private final RoomService roomService;

    @MessageMapping("/room/{roomCode}/code")
    public void handleCodeChange(
            @DestinationVariable String roomCode,
            CodeChangeMessage message,
            Principal principal) {
        message.setRoomCode(roomCode);
        message.setUsername(principal != null ? principal.getName() : "anonymous");
        message.setType("CODE_CHANGE");

        // Save latest code to DB
        roomService.updateRoomCode(roomCode, message.getContent());

        // Broadcast to all users in room via Redis
        publisher.publish(roomCode, message);
    }

    @MessageMapping("/room/{roomCode}/join")
    public void handleUserJoin(
            @DestinationVariable String roomCode,
            CodeChangeMessage message,
            Principal principal) {
        message.setRoomCode(roomCode);
        message.setUsername(principal != null ? principal.getName() : "anonymous");
        message.setType("USER_JOINED");
        publisher.publish(roomCode, message);
    }

    @MessageMapping("/room/{roomCode}/leave")
    public void handleUserLeave(
            @DestinationVariable String roomCode,
            CodeChangeMessage message,
            Principal principal) {
        message.setRoomCode(roomCode);
        message.setUsername(principal != null ? principal.getName() : "anonymous");
        message.setType("USER_LEFT");
        publisher.publish(roomCode, message);
    }
}