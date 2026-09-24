package com.carwash.payment.service;

import com.carwash.payment.entity.Payment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PdfServiceTest {

    @InjectMocks
    private PdfService pdfService;

    @Test
    void generateReceipt_Success() throws IOException {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setOrderId(100L);
        payment.setCustomerUsername("testuser");
        payment.setAmount(new BigDecimal("75.50"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setTransactionId("txn_123456789");
        payment.setPaymentMethod("Stripe");
        payment.setServiceType("PREMIUM_WASH");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_WithNullServiceType() throws IOException {
        Payment payment = new Payment();
        payment.setId(2L);
        payment.setOrderId(200L);
        payment.setCustomerUsername("user2");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setServiceType(null);
        payment.setCreatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_WithNullPaymentMethod() throws IOException {
        Payment payment = new Payment();
        payment.setId(3L);
        payment.setOrderId(300L);
        payment.setCustomerUsername("user3");
        payment.setAmount(new BigDecimal("100.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaymentMethod(null);
        payment.setServiceType("BASIC_WASH");
        payment.setCreatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_WithNullTransactionId() throws IOException {
        Payment payment = new Payment();
        payment.setId(4L);
        payment.setOrderId(400L);
        payment.setCustomerUsername("user4");
        payment.setAmount(new BigDecimal("25.00"));
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setTransactionId(null);
        payment.setServiceType("EXPRESS_WASH");
        payment.setCreatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_WithUnderscoreInServiceType() throws IOException {
        Payment payment = new Payment();
        payment.setId(5L);
        payment.setOrderId(500L);
        payment.setCustomerUsername("user5");
        payment.setAmount(new BigDecimal("150.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setServiceType("DELUXE_PREMIUM_WASH");
        payment.setCreatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_WithLargeAmount() throws IOException {
        Payment payment = new Payment();
        payment.setId(6L);
        payment.setOrderId(600L);
        payment.setCustomerUsername("user6");
        payment.setAmount(new BigDecimal("9999.99"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setServiceType("ULTIMATE_WASH");
        payment.setCreatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_WithSmallAmount() throws IOException {
        Payment payment = new Payment();
        payment.setId(7L);
        payment.setOrderId(700L);
        payment.setCustomerUsername("user7");
        payment.setAmount(new BigDecimal("0.01"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setServiceType("MINI_WASH");
        payment.setCreatedAt(LocalDateTime.now());
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    void generateReceipt_AllFieldsPopulated() throws IOException {
        Payment payment = new Payment();
        payment.setId(8L);
        payment.setOrderId(800L);
        payment.setCustomerUsername("completeuser");
        payment.setAmount(new BigDecimal("125.75"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setTransactionId("complete_txn_123");
        payment.setPaymentMethod("Credit Card");
        payment.setServiceType("FULL_SERVICE_WASH");
        payment.setCreatedAt(LocalDateTime.of(2024, 1, 15, 10, 30));
        payment.setUpdatedAt(LocalDateTime.of(2024, 1, 15, 11, 0));
        
        byte[] pdfBytes = pdfService.generateReceipt(payment);
        
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }
}
