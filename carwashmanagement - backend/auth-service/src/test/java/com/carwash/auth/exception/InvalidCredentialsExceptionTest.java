package com.carwash.auth.exception;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class InvalidCredentialsExceptionTest {

    @Test
    void constructor_SetsMessage() {
        InvalidCredentialsException exception = new InvalidCredentialsException("Invalid credentials");
        
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void extendsRuntimeException() {
        InvalidCredentialsException exception = new InvalidCredentialsException("Test");
        
        assertTrue(exception instanceof RuntimeException);
    }
}
