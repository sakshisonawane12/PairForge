package com.paircode.service;

    import com.paircode.dto.AuthRequest;
    import com.paircode.dto.AuthResponse;
    import com.paircode.dto.RegisterRequest;
    import com.paircode.exception.UserAlreadyExistsException;
    import com.paircode.model.User;
    import com.paircode.repository.UserRepository;
    import com.paircode.security.JwtUtil;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.springframework.security.core.AuthenticationException;
    import com.paircode.exception.InvalidCredentialsException;
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
            return new AuthResponse(token, u.getUsername());
        }

        public AuthResponse login(AuthRequest req) {
            try {
                authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
                String token = jwtUtil.generateToken(req.getUsername());
                return new AuthResponse(token, req.getUsername());
            } catch (AuthenticationException e) {
                throw new InvalidCredentialsException("Invalid username or password.");
            }
        }
    }
