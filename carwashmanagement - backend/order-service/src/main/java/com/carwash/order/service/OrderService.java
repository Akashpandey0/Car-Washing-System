// Service for order management business logic
package com.carwash.order.service;

import com.carwash.order.dto.OrderRequest;
import com.carwash.order.dto.OrderResponse;
import com.carwash.order.entity.Order;
import com.carwash.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    public OrderResponse createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerUsername(request.getCustomerUsername());
        order.setCarLicensePlate(request.getCarLicensePlate() != null ? request.getCarLicensePlate() : request.getLicensePlate());
        order.setServiceType(request.getServiceType());
        order.setTotalAmount(request.getTotalAmount() != null ? request.getTotalAmount() : request.getAmount());
        order.setScheduledDateTime(request.getScheduledDateTime() != null ? request.getScheduledDateTime() : request.getScheduledTime());
        order.setCustomerAddress(request.getCustomerAddress() != null ? request.getCustomerAddress() : request.getAddress());
        
        order = orderRepository.save(order);
        
        return mapToResponse(order);
    }
    
    public List<OrderResponse> getOrdersByCustomer(String customerUsername) {
        return orderRepository.findByCustomerUsername(customerUsername).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getOrdersByWasher(String washerUsername) {
        return orderRepository.findByWasherUsername(washerUsername).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }
    
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        order.setUpdatedAt(LocalDateTime.now());
        
        order = orderRepository.save(order);
        return mapToResponse(order);
    }
    
    public OrderResponse assignWasher(Long id, String washerUsername) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setWasherUsername(washerUsername);
        order.setStatus(Order.OrderStatus.ASSIGNED);
        order.setUpdatedAt(LocalDateTime.now());
        
        order = orderRepository.save(order);
        return mapToResponse(order);
    }
    
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerUsername(order.getCustomerUsername());
        response.setLicensePlate(order.getCarLicensePlate());
        response.setServiceType(order.getServiceType());
        response.setAmount(order.getTotalAmount());
        response.setStatus(order.getStatus().name());
        response.setWasherUsername(order.getWasherUsername());
        response.setScheduledTime(order.getScheduledDateTime());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
}
