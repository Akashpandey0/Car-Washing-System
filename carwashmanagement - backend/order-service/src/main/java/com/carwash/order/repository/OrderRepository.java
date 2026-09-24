// Repository for Order entity database operations
package com.carwash.order.repository;

import com.carwash.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByCustomerUsername(String customerUsername);
    
    List<Order> findByWasherUsername(String washerUsername);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByCarLicensePlate(String carLicensePlate);
}
