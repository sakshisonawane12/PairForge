package com.paircode.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final Key key;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret:change-this-local-secret}") String secret,
                   @Value("${jwt.expiration-ms:28800000}") long expirationMs) {
        // Ensure the key material is at least 256 bits (32 bytes) required by HS256.
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        boolean usedFallback = "change-this-local-secret".equals(secret);
        if (keyBytes.length < 32) {
            logger.warn("Configured JWT secret is shorter than 32 bytes; deriving a 256-bit key by hashing. Provide a >=32-byte secret in production.");
            try {
                MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
                keyBytes = sha256.digest(keyBytes);
            } catch (NoSuchAlgorithmException e) {
                logger.error("SHA-256 algorithm not available, using raw secret bytes (not recommended)", e);
            }
        }
        if (usedFallback) {
            logger.warn("Using default fallback JWT secret — replace with a secure secret via environment variable PAIRFORGE_JWT_SECRET or application properties for production.");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}
