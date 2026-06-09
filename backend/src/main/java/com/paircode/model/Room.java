package com.paircode.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomCode;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String currentCode;

    @Column
    private String language = "javascript";

    @Column
    private boolean active = true;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @Column
    private String password;

    @Column
    private boolean isPrivate = false;
}