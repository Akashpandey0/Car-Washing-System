package com.carwash.auth.service;

import com.carwash.auth.dto.AuthResponse;
import com.carwash.auth.dto.LoginRequest;
import com.carwash.auth.dto.RegisterRequest;
import com.carwash.auth.entity.User;
import com.carwash.auth.repository.UserRepository;
import com.carwash.auth.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("pass");
        
        User user = new User();
        user.setUsername("user");
        user.setPassword("encoded");
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass", "encoded")).thenReturn(true);
        when(jwtUtil.generateToken("user", "CUSTOMER")).thenReturn("token");
        
        AuthResponse response = authService.login(request, "CUSTOMER");
        
        assertEquals("token", response.getToken());
        assertEquals("user", response.getUsername());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void login_UserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        
        when(userRepository.findByUsername("user")).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> authService.login(request, "CUSTOMER"));
    }

    @Test
    void login_InvalidRole() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        
        User user = new User();
        user.setRole(User.Role.CUSTOMER);
        
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        
        assertThrows(RuntimeException.class, () -> authService.login(request, "ADMIN"));
    }

    @Test
    void login_InactiveUser() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        
        User user = new User();
        user.setRole(User.Role.CUSTOMER);
        user.setActive(false);
        
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        
        assertThrows(RuntimeException.class, () -> authService.login(request, "CUSTOMER"));
    }

    @Test
    void login_InvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("wrong");
        
        User user = new User();
        user.setUsername("user");
        user.setPassword("encoded");
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);
        
        assertThrows(RuntimeException.class, () -> authService.login(request, "CUSTOMER"));
    }

    @Test
    void register_CustomerSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user");
        request.setPassword("pass");
        request.setEmail("email@test.com");
        
        when(userRepository.existsByUsername("user")).thenReturn(false);
        when(userRepository.existsByEmail("email@test.com")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("encoded");
        
        ResponseEntity<String> response = authService.register(request, "CUSTOMER", null);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("CUSTOMER registered successfully"));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_UsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user");
        
        when(userRepository.existsByUsername("user")).thenReturn(true);
        
        ResponseEntity<String> response = authService.register(request, "CUSTOMER", null);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username already exists", response.getBody());
    }

    @Test
    void register_EmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("user");
        request.setEmail("email@test.com");
        
        when(userRepository.existsByUsername("user")).thenReturn(false);
        when(userRepository.existsByEmail("email@test.com")).thenReturn(true);
        
        ResponseEntity<String> response = authService.register(request, "CUSTOMER", null);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email already exists", response.getBody());
    }

    @Test
    void register_AdminWithoutToken() {
        RegisterRequest request = new RegisterRequest();
        when(userRepository.countByRole(User.Role.ADMIN)).thenReturn(1L);
        
        ResponseEntity<String> response = authService.register(request, "ADMIN", null);
        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Admin registration requires authentication from existing admin", response.getBody());
    }

    @Test
    void adminRegister_NoToken() {
        RegisterRequest request = new RegisterRequest();
        
        ResponseEntity<String> response = authService.adminRegister(request, "WASHER", null);
        
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Authentication required", response.getBody());
    }

    @Test
    void deleteUser_InvalidToken() {
        assertThrows(RuntimeException.class, () -> authService.deleteUser(null, null));
    }

    @Test
    void deleteUser_TokenWithoutBearer() {
        assertThrows(RuntimeException.class, () -> authService.deleteUser("token", null));
    }

    @Test
    void deleteUser_EmptyToken() {
        assertThrows(RuntimeException.class, () -> authService.deleteUser("Bearer ", null));
    }
}
