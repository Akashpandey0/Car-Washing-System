package com.carwash.car.service;

import com.carwash.car.dto.CarRequest;
import com.carwash.car.dto.CarResponse;
import com.carwash.car.entity.Car;
import com.carwash.car.exception.CarNotFoundException;
import com.carwash.car.exception.DuplicateCarException;
import com.carwash.car.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public CarResponse registerCar(CarRequest request) {
        if (request.getLicensePlate() == null || request.getLicensePlate().trim().isEmpty())
            throw new RuntimeException("License plate is required");
        if (request.getMake() == null || request.getMake().trim().isEmpty())
            throw new RuntimeException("Make is required");
        if (request.getModel() == null || request.getModel().trim().isEmpty())
            throw new RuntimeException("Model is required");

        String owner = request.getCustomerUsername() != null ? request.getCustomerUsername() : request.getOwnerUsername();
        if (owner == null || owner.trim().isEmpty())
            throw new RuntimeException("Owner username is required");

        if (carRepository.existsByLicensePlate(request.getLicensePlate()))
            throw new DuplicateCarException("Car with this license plate already exists");

        Car car = new Car();
        car.setOwnerUsername(owner);
        car.setLicensePlate(request.getLicensePlate());
        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setColor(request.getColor());
        car.setCountry(request.getCountry());

        try {
            car.setType(request.getType() != null ? Car.CarType.valueOf(request.getType().toUpperCase()) : Car.CarType.SEDAN);
        } catch (IllegalArgumentException e) {
            car.setType(Car.CarType.SEDAN);
        }

        return mapToResponse(carRepository.save(car));
    }

    public List<CarResponse> getCarsByCustomer(String customerUsername) {
        return carRepository.findByOwnerUsername(customerUsername).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CarResponse getCarByLicensePlate(String licensePlate) {
        Car car = carRepository.findByLicensePlate(licensePlate)
                .orElseThrow(() -> new CarNotFoundException("Car not found"));
        return mapToResponse(car);
    }

    public List<CarResponse> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CarResponse updateCar(String licensePlate, CarRequest request) {
        Car car = carRepository.findByLicensePlate(licensePlate)
                .orElseThrow(() -> new CarNotFoundException("Car not found"));

        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setColor(request.getColor());
        car.setCountry(request.getCountry());

        return mapToResponse(carRepository.save(car));
    }

    private CarResponse mapToResponse(Car car) {
        CarResponse response = new CarResponse();
        response.setId(car.getId());
        response.setCustomerUsername(car.getOwnerUsername());
        response.setLicensePlate(car.getLicensePlate());
        response.setMake(car.getMake());
        response.setModel(car.getModel());
        response.setYear(car.getYear());
        response.setColor(car.getColor());
        response.setCountry(car.getCountry());
        response.setType(car.getType() != null ? car.getType().name() : null);
        response.setActive(car.isActive());
        response.setCreatedAt(car.getCreatedAt());
        return response;
    }
}
