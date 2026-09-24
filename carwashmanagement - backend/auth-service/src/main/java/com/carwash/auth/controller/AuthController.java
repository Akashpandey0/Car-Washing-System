package com.carwash.auth.controller;

import com.carwash.auth.dto.AuthResponse;
import com.carwash.auth.dto.LoginRequest;
import com.carwash.auth.dto.RegisterRequest;
import com.carwash.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/{role}")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request,
            @PathVariable String role,
            @RequestHeader(value = "Authorization", required = false) String token) {
        return authService.register(request, role, token);
    }

    @PostMapping("/admin/register/{role}")
    public ResponseEntity<String> adminRegister(
            @RequestBody RegisterRequest request,
            @PathVariable String role,
            @RequestHeader("Authorization") String token) {
        return authService.adminRegister(request, role, token);
    }

    @PostMapping("/login/{role}")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request,
            @PathVariable String role) {
        try {
            AuthResponse response = authService.login(request, role);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(
            @RequestHeader("Authorization") String token,
            @RequestBody(required = false) String username) {
        try {
            authService.deleteUser(token, username);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam("token") String token) {
        try {
            authService.validateToken(token);
            return ResponseEntity.ok("Token is valid");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        return authService.getAllUsers(token);
    }
}
