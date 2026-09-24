package com.carwash.auth.service;

import com.carwash.auth.dto.AuthResponse;
import com.carwash.auth.dto.LoginRequest;
import com.carwash.auth.dto.RegisterRequest;
import com.carwash.auth.entity.User;
import com.carwash.auth.repository.UserRepository;
import com.carwash.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request, String role) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equalsIgnoreCase(role))
            throw new RuntimeException("Invalid role for this user");

        if (!user.isActive())
            throw new RuntimeException("User account is deactivated");

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    public ResponseEntity<String> register(RegisterRequest request, String role, String token) {
        if (role.equalsIgnoreCase("ADMIN")) {
            long adminCount = userRepository.countByRole(User.Role.ADMIN);
            if (adminCount > 0) {
                String adminRole = extractAdminRole(token);
                if (adminRole == null) return ResponseEntity.status(401).body("Admin registration requires authentication from existing admin");
                if (!"ADMIN".equals(adminRole)) return ResponseEntity.status(403).body("Only admins can register new admins");
            }
        }
        return createUser(request, role, " registered successfully. Please login.");
    }

    public ResponseEntity<String> adminRegister(RegisterRequest request, String role, String token) {
        String adminRole = extractAdminRole(token);
        if (adminRole == null) return ResponseEntity.status(401).body("Authentication required");
        if (!"ADMIN".equals(adminRole)) return ResponseEntity.status(403).body("Only admins can use this endpoint");
        return createUser(request, role, " registered successfully by admin.");
    }

    public void deleteUser(String token, String usernameToDelete) {
        if (token == null || !token.startsWith("Bearer ") || token.length() <= 7)
            throw new RuntimeException("Invalid authorization token");

        String jwtToken = token.substring(7);
        jwtUtil.validateToken(jwtToken);

        String loggedInUsername = jwtUtil.extractUsername(jwtToken);
        String role = (String) jwtUtil.extractAllClaims(jwtToken).get("role");

        if ("ADMIN".equals(role)) {
            if (usernameToDelete == null || usernameToDelete.trim().isEmpty())
                throw new RuntimeException("Admin must provide username to delete");
            User user = userRepository.findByUsername(usernameToDelete)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            userRepository.delete(user);
        } else {
            User user = userRepository.findByUsername(loggedInUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            userRepository.delete(user);
        }
    }

    public void validateToken(String token) {
        jwtUtil.validateToken(token);
    }

    public ResponseEntity<?> getAllUsers(String token) {
        String role = extractAdminRole(token);
        if (role == null) return ResponseEntity.status(401).body("Authentication required");
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).body("Only admins can view all users");

        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("role", u.getRole().name());
            map.put("active", u.isActive());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    private ResponseEntity<String> createUser(RegisterRequest request, String role, String successSuffix) {
        if (userRepository.existsByUsername(request.getUsername()))
            return ResponseEntity.badRequest().body("Username already exists");
        if (userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.badRequest().body("Email already exists");

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepository.save(user);

        return ResponseEntity.ok(role + successSuffix);
    }

    private String extractAdminRole(String token) {
        if (token == null || !token.startsWith("Bearer ")) return null;
        try {
            String jwtToken = token.substring(7);
            jwtUtil.validateToken(jwtToken);
            return (String) jwtUtil.extractAllClaims(jwtToken).get("role");
        } catch (Exception e) {
            return null;
        }
    }
}
