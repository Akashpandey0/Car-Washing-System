package com.carwash.auth.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void gettersAndSetters_Work() {
        LoginRequest request = new LoginRequest();
        
        request.setUsername("testuser");
        request.setPassword("testpass");
        
        assertEquals("testuser", request.getUsername());
        assertEquals("testpass", request.getPassword());
    }
}
