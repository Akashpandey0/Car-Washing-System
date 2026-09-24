package com.carwash.auth.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuthResponseTest {

    @Test
    void constructor_SetsAllFields() {
        AuthResponse response = new AuthResponse("token123", "user", "CUSTOMER");
        
        assertEquals("token123", response.getToken());
        assertEquals("user", response.getUsername());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void setters_UpdateFields() {
        AuthResponse response = new AuthResponse("token", "user", "CUSTOMER");
        
        response.setToken("newToken");
        response.setUsername("newUser");
        response.setRole("ADMIN");
        
        assertEquals("newToken", response.getToken());
        assertEquals("newUser", response.getUsername());
        assertEquals("ADMIN", response.getRole());
    }
}
