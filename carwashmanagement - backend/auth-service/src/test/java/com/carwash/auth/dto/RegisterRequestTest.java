package com.carwash.auth.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestTest {

    @Test
    void gettersAndSetters_Work() {
        RegisterRequest request = new RegisterRequest();
        
        request.setUsername("testuser");
        request.setPassword("testpass");
        request.setEmail("test@test.com");
        
        assertEquals("testuser", request.getUsername());
        assertEquals("testpass", request.getPassword());
        assertEquals("test@test.com", request.getEmail());
    }
}
