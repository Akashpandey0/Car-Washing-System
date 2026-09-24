package com.carwash.car.controller;

import com.carwash.car.dto.CarRequest;
import com.carwash.car.dto.CarResponse;
import com.carwash.car.service.CarService;
import com.carwash.car.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> registerCar(@RequestBody CarRequest request, @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            String role = jwtUtil.extractRole(jwtToken);
            String username = jwtUtil.extractUsername(jwtToken);

            if (!(("CUSTOMER".equals(role) || "ADMIN".equals(role))))
                return ResponseEntity.status(403).body("Only CUSTOMER and ADMIN can register cars");

            request.setCustomerUsername(username);
            return ResponseEntity.ok(carService.registerCar(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/owner/{username}")
    public ResponseEntity<List<CarResponse>> getCarsByOwner(@PathVariable String username) {
        return ResponseEntity.ok(carService.getCarsByCustomer(username));
    }

    @GetMapping("/{licensePlate}")
    public ResponseEntity<CarResponse> getCarByLicensePlate(@PathVariable String licensePlate) {
        try {
            return ResponseEntity.ok(carService.getCarByLicensePlate(licensePlate));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CarResponse>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @PutMapping("/{licensePlate}")
    public ResponseEntity<CarResponse> updateCar(@PathVariable String licensePlate, @RequestBody CarRequest request) {
        try {
            return ResponseEntity.ok(carService.updateCar(licensePlate, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
