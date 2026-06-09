package com.paircode.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paircode.dto.CodeChangeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisMessagePublisher {

    private static final Logger log = LoggerFactory.getLogger(RedisMessagePublisher.class);
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public void publish(String roomCode, CodeChangeMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            redisTemplate.convertAndSend("room:" + roomCode, json);
        } catch (Exception e) {
            log.error("Failed to publish message to Redis", e);
        }
    }
}