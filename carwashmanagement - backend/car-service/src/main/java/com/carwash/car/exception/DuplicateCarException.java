package com.carwash.car.exception;

public class DuplicateCarException extends RuntimeException {
    public DuplicateCarException(String message) {
        super(message);
    }
}
