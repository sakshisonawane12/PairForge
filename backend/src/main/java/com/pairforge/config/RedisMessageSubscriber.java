package com.pairforge.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pairforge.dto.CodeChangeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisMessageSubscriber implements MessageListener {

    private static final Logger log = LoggerFactory.getLogger(RedisMessageSubscriber.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public RedisMessageSubscriber(@Lazy SimpMessagingTemplate messagingTemplate,
                                  ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());
            CodeChangeMessage codeChange = objectMapper.readValue(json, CodeChangeMessage.class);
            messagingTemplate.convertAndSend(
                    "/topic/room/" + codeChange.getRoomCode(),
                    codeChange
            );
        } catch (Exception e) {
            log.error("Failed to process Redis message", e);
        }
    }
}