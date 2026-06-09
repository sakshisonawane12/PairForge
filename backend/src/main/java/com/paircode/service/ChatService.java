package com.paircode.service;

import com.paircode.model.ChatMessage;
import com.paircode.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(String roomCode, String username,
                                   String content, String type) {
        ChatMessage message = new ChatMessage();
        message.setRoomCode(roomCode);
        message.setUsername(username);
        message.setContent(content);
        message.setType(type);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getLast50Messages(String roomCode) {
        List<ChatMessage> messages = chatMessageRepository
                .findTop50ByRoomCodeOrderBySentAtDesc(roomCode);
        java.util.Collections.reverse(messages);
        return messages;
    }
}