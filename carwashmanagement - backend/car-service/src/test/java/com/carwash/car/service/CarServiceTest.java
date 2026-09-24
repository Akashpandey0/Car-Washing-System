package com.carwash.car.service;

import com.carwash.car.dto.CarRequest;
import com.carwash.car.dto.CarResponse;
import com.carwash.car.entity.Car;
import com.carwash.car.repository.CarRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarService carService;

    @Test
    void registerCar_Success() {
        CarRequest request = new CarRequest();
        request.setCustomerUsername("user");
        request.setLicensePlate("ABC123");
        request.setMake("Toyota");
        request.setModel("Camry");
        request.setYear(2020);
        request.setColor("Blue");
        request.setType("SEDAN");
        
        Car car = new Car();
        car.setId(1L);
        car.setOwnerUsername("user");
        car.setLicensePlate("ABC123");
        car.setMake("Toyota");
        car.setModel("Camry");
        car.setYear(2020);
        car.setColor("Blue");
        car.setType(Car.CarType.SEDAN);
        
        when(carRepository.existsByLicensePlate("ABC123")).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenReturn(car);
        
        CarResponse response = carService.registerCar(request);
        
        assertNotNull(response);
        assertEquals("ABC123", response.getLicensePlate());
        assertEquals("user", response.getCustomerUsername());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void registerCar_WithOwnerUsername() {
        CarRequest request = new CarRequest();
        request.setOwnerUsername("owner");
        request.setLicensePlate("XYZ789");
        request.setMake("Honda");
        request.setModel("Civic");
        request.setYear(2021);
        request.setColor("Red");
        
        Car car = new Car();
        car.setId(1L);
        car.setOwnerUsername("owner");
        car.setLicensePlate("XYZ789");
        
        when(carRepository.existsByLicensePlate("XYZ789")).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenReturn(car);
        
        CarResponse response = carService.registerCar(request);
        
        assertNotNull(response);
        assertEquals("owner", response.getCustomerUsername());
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void registerCar_DefaultType() {
        CarRequest request = new CarRequest();
        request.setCustomerUsername("user");
        request.setLicensePlate("DEF456");
        request.setMake("Ford");
        request.setModel("Focus");
        request.setYear(2019);
        request.setColor("Black");
        
        Car car = new Car();
        car.setId(1L);
        car.setType(Car.CarType.SEDAN);
        
        when(carRepository.existsByLicensePlate("DEF456")).thenReturn(false);
        when(carRepository.save(any(Car.class))).thenReturn(car);
        
        CarResponse response = carService.registerCar(request);
        
        assertNotNull(response);
        verify(carRepository).save(any(Car.class));
    }

    @Test
    void registerCar_DuplicateLicensePlate() {
        CarRequest request = new CarRequest();
        request.setLicensePlate("ABC123");
        request.setMake("Toyota");
        request.setModel("Camry");
        request.setCustomerUsername("user");
        
        when(carRepository.existsByLicensePlate("ABC123")).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> carService.registerCar(request));
        verify(carRepository, never()).save(any());
    }

    @Test
    void getCarsByCustomer_Success() {
        Car car1 = new Car();
        car1.setId(1L);
        car1.setOwnerUsername("user");
        car1.setLicensePlate("ABC123");
        
        Car car2 = new Car();
        car2.setId(2L);
        car2.setOwnerUsername("user");
        car2.setLicensePlate("XYZ789");
        
        when(carRepository.findByOwnerUsername("user")).thenReturn(Arrays.asList(car1, car2));
        
        List<CarResponse> responses = carService.getCarsByCustomer("user");
        
        assertEquals(2, responses.size());
        assertEquals("ABC123", responses.get(0).getLicensePlate());
        assertEquals("XYZ789", responses.get(1).getLicensePlate());
        verify(carRepository).findByOwnerUsername("user");
    }

    @Test
    void getCarsByCustomer_Empty() {
        when(carRepository.findByOwnerUsername("user")).thenReturn(Arrays.asList());
        
        List<CarResponse> responses = carService.getCarsByCustomer("user");
        
        assertEquals(0, responses.size());
        verify(carRepository).findByOwnerUsername("user");
    }

    @Test
    void getCarByLicensePlate_Success() {
        Car car = new Car();
        car.setId(1L);
        car.setLicensePlate("ABC123");
        car.setOwnerUsername("user");
        
        when(carRepository.findByLicensePlate("ABC123")).thenReturn(Optional.of(car));
        
        CarResponse response = carService.getCarByLicensePlate("ABC123");
        
        assertNotNull(response);
        assertEquals("ABC123", response.getLicensePlate());
        verify(carRepository).findByLicensePlate("ABC123");
    }

    @Test
    void getCarByLicensePlate_NotFound() {
        when(carRepository.findByLicensePlate("ABC123")).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> carService.getCarByLicensePlate("ABC123"));
        verify(carRepository).findByLicensePlate("ABC123");
    }

    @Test
    void getAllCars_Success() {
        Car car1 = new Car();
        car1.setId(1L);
        car1.setLicensePlate("ABC123");
        
        Car car2 = new Car();
        car2.setId(2L);
        car2.setLicensePlate("XYZ789");
        
        when(carRepository.findAll()).thenReturn(Arrays.asList(car1, car2));
        
        List<CarResponse> responses = carService.getAllCars();
        
        assertEquals(2, responses.size());
        verify(carRepository).findAll();
    }

    @Test
    void getAllCars_Empty() {
        when(carRepository.findAll()).thenReturn(Arrays.asList());
        
        List<CarResponse> responses = carService.getAllCars();
        
        assertEquals(0, responses.size());
        verify(carRepository).findAll();
    }

    @Test
    void updateCar_Success() {
        CarRequest request = new CarRequest();
        request.setMake("Toyota");
        request.setModel("Camry");
        request.setYear(2022);
        request.setColor("White");
        
        Car car = new Car();
        car.setId(1L);
        car.setLicensePlate("ABC123");
        car.setMake("Honda");
        car.setModel("Civic");
        
        Car updatedCar = new Car();
        updatedCar.setId(1L);
        updatedCar.setLicensePlate("ABC123");
        updatedCar.setMake("Toyota");
        updatedCar.setModel("Camry");
        updatedCar.setYear(2022);
        updatedCar.setColor("White");
        
        when(carRepository.findByLicensePlate("ABC123")).thenReturn(Optional.of(car));
        when(carRepository.save(any(Car.class))).thenReturn(updatedCar);
        
        CarResponse response = carService.updateCar("ABC123", request);
        
        assertNotNull(response);
        assertEquals("ABC123", response.getLicensePlate());
        verify(carRepository).save(car);
    }

    @Test
    void updateCar_NotFound() {
        CarRequest request = new CarRequest();
        
        when(carRepository.findByLicensePlate("ABC123")).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> carService.updateCar("ABC123", request));
        verify(carRepository, never()).save(any());
    }
}
