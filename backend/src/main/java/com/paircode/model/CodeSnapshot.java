package com.paircode.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_snapshots")
@Data
public class CodeSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomCode;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String language;

    @Column(nullable = false)
    private String savedBy;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    public void prePersist() {
        savedAt = LocalDateTime.now();
    }
}