package com.pairforge.controller;

import com.pairforge.model.ChatMessage;
import com.pairforge.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/room/{roomCode}/chat")
    public void handleChatMessage(
            @DestinationVariable String roomCode,
            ChatMessage message,
            Principal principal) {

        String username = principal != null ? principal.getName() : "anonymous";
        ChatMessage saved = chatService.saveMessage(
                roomCode, username, message.getContent(), "CHAT");

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode + "/chat", saved);
    }

    @MessageMapping("/room/{roomCode}/presence")
    public void handlePresence(
            @DestinationVariable String roomCode,
            ChatMessage message,
            Principal principal) {

        String username = principal != null ? principal.getName() : "anonymous";
        String type = message.getType() != null ? message.getType() : "JOIN";

        ChatMessage presence = chatService.saveMessage(
                roomCode, username,
                username + (type.equals("JOIN") ? " joined the room" : " left the room"),
                type);

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomCode + "/chat", presence);
    }
}