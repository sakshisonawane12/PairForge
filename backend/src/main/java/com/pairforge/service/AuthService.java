package com.pairforge.service;

import com.pairforge.dto.AuthRequest;
import com.pairforge.dto.AuthResponse;
import com.pairforge.dto.RegisterRequest;
import com.pairforge.exception.UserAlreadyExistsException;
import com.pairforge.model.User;
import com.pairforge.repository.UserRepository;
import com.pairforge.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.AuthenticationException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder encoder,
                       AuthenticationManager authManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken.");
        }
        if (req.getEmail() != null && userRepository.existsByEmail(req.getEmail())) {
            throw new UserAlreadyExistsException("Email is already taken.");
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        userRepository.save(u);
        String token = jwtUtil.generateToken(u.getUsername());
        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest req) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
            String token = jwtUtil.generateToken(req.getUsername());
            return new AuthResponse(token);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password.");
        }
    }
}
