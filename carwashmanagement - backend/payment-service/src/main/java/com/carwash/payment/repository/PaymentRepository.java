// Repository for Payment entity database operations
package com.carwash.payment.repository;

import com.carwash.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByCustomerUsername(String customerUsername);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    Optional<Payment> findByTransactionId(String transactionId);
}
