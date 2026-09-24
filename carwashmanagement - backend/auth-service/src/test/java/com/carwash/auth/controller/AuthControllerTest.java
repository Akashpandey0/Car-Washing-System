package com.carwash.auth.controller;

import com.carwash.auth.dto.AuthResponse;
import com.carwash.auth.dto.LoginRequest;
import com.carwash.auth.dto.RegisterRequest;
import com.carwash.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        when(authService.register(any(), anyString(), any())).thenReturn(ResponseEntity.ok("User registered"));
        
        ResponseEntity<String> response = authController.register(request, "CUSTOMER", null);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authService).register(request, "CUSTOMER", null);
    }

    @Test
    void register_WithToken() {
        RegisterRequest request = new RegisterRequest();
        when(authService.register(any(), anyString(), anyString())).thenReturn(ResponseEntity.ok("Admin registered"));
        
        ResponseEntity<String> response = authController.register(request, "ADMIN", "Bearer token");
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authService).register(request, "ADMIN", "Bearer token");
    }

    @Test
    void adminRegister_Success() {
        RegisterRequest request = new RegisterRequest();
        when(authService.adminRegister(any(), anyString(), anyString())).thenReturn(ResponseEntity.ok("User registered by admin"));
        
        ResponseEntity<String> response = authController.adminRegister(request, "WASHER", "Bearer token");
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authService).adminRegister(request, "WASHER", "Bearer token");
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        AuthResponse authResponse = new AuthResponse("token", "user", "CUSTOMER");
        when(authService.login(any(), anyString())).thenReturn(authResponse);
        
        ResponseEntity<AuthResponse> response = authController.login(request, "CUSTOMER");
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("token", response.getBody().getToken());
        verify(authService).login(request, "CUSTOMER");
    }

    @Test
    void login_Failure() {
        LoginRequest request = new LoginRequest();
        when(authService.login(any(), anyString())).thenThrow(new RuntimeException("Invalid credentials"));
        
        ResponseEntity<AuthResponse> response = authController.login(request, "CUSTOMER");
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(authService).login(request, "CUSTOMER");
    }

    @Test
    void deleteUser_Success() {
        doNothing().when(authService).deleteUser(anyString(), anyString());
        
        ResponseEntity<String> response = authController.deleteUser("Bearer token", "username");
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully.", response.getBody());
        verify(authService).deleteUser("Bearer token", "username");
    }

    @Test
    void deleteUser_Failure() {
        doThrow(new RuntimeException("User not found")).when(authService).deleteUser(anyString(), anyString());
        
        ResponseEntity<String> response = authController.deleteUser("Bearer token", "username");
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found", response.getBody());
        verify(authService).deleteUser("Bearer token", "username");
    }

    @Test
    void validateToken_Success() {
        doNothing().when(authService).validateToken(anyString());
        
        ResponseEntity<String> response = authController.validateToken("token");
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Token is valid", response.getBody());
        verify(authService).validateToken("token");
    }

    @Test
    void validateToken_Failure() {
        doThrow(new RuntimeException("Invalid token")).when(authService).validateToken(anyString());
        
        ResponseEntity<String> response = authController.validateToken("token");
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid token", response.getBody());
        verify(authService).validateToken("token");
    }
}
