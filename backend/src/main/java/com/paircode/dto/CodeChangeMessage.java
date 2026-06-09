package com.paircode.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeChangeMessage {
    private String roomCode;
    private String content;
    private String language;
    private String username;
    private String type;
}