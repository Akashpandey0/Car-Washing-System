package com.carwash.car.controller;

import com.carwash.car.dto.CarRequest;
import com.carwash.car.dto.CarResponse;
import com.carwash.car.service.CarService;
import com.carwash.car.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarControllerTest {

    @Mock
    private CarService carService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private CarController carController;

    @Test
    void registerCar_CustomerSuccess() {
        CarRequest request = new CarRequest();
        request.setLicensePlate("ABC123");
        CarResponse response = new CarResponse();
        
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(carService.registerCar(any())).thenReturn(response);
        
        ResponseEntity<?> result = carController.registerCar(request, "Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(carService).registerCar(request);
    }

    @Test
    void registerCar_AdminSuccess() {
        CarRequest request = new CarRequest();
        CarResponse response = new CarResponse();
        
        when(jwtUtil.extractRole("token")).thenReturn("ADMIN");
        when(jwtUtil.extractUsername("token")).thenReturn("admin");
        when(carService.registerCar(any())).thenReturn(response);
        
        ResponseEntity<?> result = carController.registerCar(request, "Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(carService).registerCar(request);
    }

    @Test
    void registerCar_WasherForbidden() {
        CarRequest request = new CarRequest();
        
        when(jwtUtil.extractRole("token")).thenReturn("WASHER");
        when(jwtUtil.extractUsername("token")).thenReturn("washer");
        
        ResponseEntity<?> result = carController.registerCar(request, "Bearer token");
        
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        verify(carService, never()).registerCar(any());
    }

    @Test
    void registerCar_Exception() {
        CarRequest request = new CarRequest();
        
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(carService.registerCar(any())).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<?> result = carController.registerCar(request, "Bearer token");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().toString().contains("Error"));
    }

    @Test
    void getCarsByOwner_Success() {
        CarResponse car1 = new CarResponse();
        CarResponse car2 = new CarResponse();
        List<CarResponse> cars = Arrays.asList(car1, car2);
        
        when(carService.getCarsByCustomer("user")).thenReturn(cars);
        
        ResponseEntity<List<CarResponse>> result = carController.getCarsByOwner("user");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());
        verify(carService).getCarsByCustomer("user");
    }

    @Test
    void getCarByLicensePlate_Success() {
        CarResponse response = new CarResponse();
        response.setLicensePlate("ABC123");
        
        when(carService.getCarByLicensePlate("ABC123")).thenReturn(response);
        
        ResponseEntity<CarResponse> result = carController.getCarByLicensePlate("ABC123");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("ABC123", result.getBody().getLicensePlate());
        verify(carService).getCarByLicensePlate("ABC123");
    }

    @Test
    void getCarByLicensePlate_NotFound() {
        when(carService.getCarByLicensePlate("ABC123")).thenThrow(new RuntimeException("Not found"));
        
        ResponseEntity<CarResponse> result = carController.getCarByLicensePlate("ABC123");
        
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        verify(carService).getCarByLicensePlate("ABC123");
    }

    @Test
    void getAllCars_Success() {
        CarResponse car1 = new CarResponse();
        CarResponse car2 = new CarResponse();
        List<CarResponse> cars = Arrays.asList(car1, car2);
        
        when(carService.getAllCars()).thenReturn(cars);
        
        ResponseEntity<List<CarResponse>> result = carController.getAllCars();
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());
        verify(carService).getAllCars();
    }

    @Test
    void updateCar_Success() {
        CarRequest request = new CarRequest();
        CarResponse response = new CarResponse();
        
        when(carService.updateCar("ABC123", request)).thenReturn(response);
        
        ResponseEntity<CarResponse> result = carController.updateCar("ABC123", request);
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(carService).updateCar("ABC123", request);
    }

    @Test
    void updateCar_NotFound() {
        CarRequest request = new CarRequest();
        
        when(carService.updateCar("ABC123", request)).thenThrow(new RuntimeException("Not found"));
        
        ResponseEntity<CarResponse> result = carController.updateCar("ABC123", request);
        
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        verify(carService).updateCar("ABC123", request);
    }
}
