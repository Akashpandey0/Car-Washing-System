package com.carwash.auth.exception;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserNotFoundExceptionTest {

    @Test
    void constructor_SetsMessage() {
        UserNotFoundException exception = new UserNotFoundException("User not found");
        
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void extendsRuntimeException() {
        UserNotFoundException exception = new UserNotFoundException("Test");
        
        assertTrue(exception instanceof RuntimeException);
    }
}
