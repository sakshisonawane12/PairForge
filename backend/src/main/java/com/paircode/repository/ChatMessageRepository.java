package com.paircode.repository;

import com.paircode.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByRoomCodeOrderBySentAtAsc(String roomCode);
    List<ChatMessage> findTop50ByRoomCodeOrderBySentAtDesc(String roomCode);
}