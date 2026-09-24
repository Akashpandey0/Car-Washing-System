// Controller for order management endpoints
package com.carwash.order.controller;

import com.carwash.order.dto.OrderRequest;
import com.carwash.order.dto.OrderResponse;
import com.carwash.order.service.OrderService;
import com.carwash.order.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            String role = jwtUtil.extractRole(jwtToken);
            String username = jwtUtil.extractUsername(jwtToken);
            
            if (!("CUSTOMER".equals(role) || "ADMIN".equals(role))) {
                return ResponseEntity.status(403).body("Only CUSTOMER and ADMIN can create orders");
            }
            
            request.setCustomerUsername(username);
            OrderResponse response = orderService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/customer")
    public ResponseEntity<?> getOrdersByCustomer(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            String role = jwtUtil.extractRole(jwtToken);
            String username = jwtUtil.extractUsername(jwtToken);
            
            if (!("CUSTOMER".equals(role) || "ADMIN".equals(role))) {
                return ResponseEntity.status(403).body("Only CUSTOMER and ADMIN can view orders");
            }
            
            List<OrderResponse> orders = orderService.getOrdersByCustomer(username);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/washer")
    public ResponseEntity<?> getOrdersByWasher(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            String role = jwtUtil.extractRole(jwtToken);
            String username = jwtUtil.extractUsername(jwtToken);
            
            if (!("WASHER".equals(role) || "ADMIN".equals(role))) {
                return ResponseEntity.status(403).body("Only WASHER and ADMIN can view washer orders");
            }
            
            List<OrderResponse> orders = orderService.getOrdersByWasher(username);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        try {
            OrderResponse response = orderService.getOrderById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            OrderResponse response = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/assign")
    public ResponseEntity<OrderResponse> assignWasher(@PathVariable Long id, @RequestParam String washerUsername) {
        try {
            OrderResponse response = orderService.assignWasher(id, washerUsername);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
}
