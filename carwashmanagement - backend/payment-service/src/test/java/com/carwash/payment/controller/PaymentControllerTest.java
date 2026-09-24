package com.carwash.payment.controller;

import com.carwash.payment.dto.PaymentRequest;
import com.carwash.payment.dto.PaymentResponse;
import com.carwash.payment.entity.Payment;
import com.carwash.payment.exception.PaymentNotFoundException;
import com.carwash.payment.repository.PaymentRepository;
import com.carwash.payment.service.PaymentService;
import com.carwash.payment.service.PdfService;
import com.carwash.payment.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @Mock
    private PdfService pdfService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private PaymentController paymentController;

    @Test
    void createCheckoutSession_Success() {
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setAmount(new BigDecimal("50.00"));
        
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(paymentService.createCheckoutSession(any())).thenReturn("https://checkout.stripe.com/session");
        
        ResponseEntity<String> result = paymentController.createCheckoutSession(request, "Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("https://checkout.stripe.com/session", result.getBody());
        verify(paymentService).createCheckoutSession(request);
    }

    @Test
    void createCheckoutSession_Exception() {
        PaymentRequest request = new PaymentRequest();
        
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(paymentService.createCheckoutSession(any())).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<String> result = paymentController.createCheckoutSession(request, "Bearer token");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().contains("Error"));
    }

    @Test
    void paymentSuccess_ReturnsHtml() {
        String result = paymentController.paymentSuccess("session_123");
        
        assertNotNull(result);
        assertTrue(result.contains("Payment Successful"));
        assertTrue(result.contains("session_123"));
    }

    @Test
    void paymentCancel_ReturnsHtml() {
        String result = paymentController.paymentCancel();
        
        assertNotNull(result);
        assertTrue(result.contains("Payment Cancelled"));
    }

    @Test
    void paymentFailed_ReturnsHtml() {
        String result = paymentController.paymentFailed("Insufficient funds");
        
        assertNotNull(result);
        assertTrue(result.contains("Payment Failed"));
        assertTrue(result.contains("Insufficient funds"));
    }

    @Test
    void paymentFailed_DefaultReason() {
        String result = paymentController.paymentFailed("Unknown error");
        
        assertNotNull(result);
        assertTrue(result.contains("Unknown error"));
    }

    @Test
    void handleStripeWebhook_Success() {
        doNothing().when(paymentService).handleWebhook(anyString(), anyString());
        
        ResponseEntity<String> result = paymentController.handleStripeWebhook("payload", "signature");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Webhook received", result.getBody());
        verify(paymentService).handleWebhook("payload", "signature");
    }

    @Test
    void getPaymentByOrderId_Success() {
        PaymentResponse response = new PaymentResponse();
        response.setOrderId(1L);
        
        when(paymentService.getPaymentByOrderId(1L)).thenReturn(response);
        
        ResponseEntity<PaymentResponse> result = paymentController.getPaymentByOrderId(1L);
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1L, result.getBody().getOrderId());
        verify(paymentService).getPaymentByOrderId(1L);
    }

    @Test
    void getPaymentByOrderId_NotFound() {
        when(paymentService.getPaymentByOrderId(1L)).thenThrow(new RuntimeException("Not found"));
        
        ResponseEntity<PaymentResponse> result = paymentController.getPaymentByOrderId(1L);
        
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        verify(paymentService).getPaymentByOrderId(1L);
    }

    @Test
    void getPaymentsByCustomer_Success() {
        PaymentResponse payment1 = new PaymentResponse();
        PaymentResponse payment2 = new PaymentResponse();
        List<PaymentResponse> payments = Arrays.asList(payment1, payment2);
        
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(paymentService.getPaymentsByCustomer("user")).thenReturn(payments);
        
        ResponseEntity<List<PaymentResponse>> result = paymentController.getPaymentsByCustomer("Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());
        verify(paymentService).getPaymentsByCustomer("user");
    }

    @Test
    void createPaymentIntent_Success() {
        when(paymentService.createPaymentIntent(any())).thenReturn("client_secret_123");
        
        ResponseEntity<String> result = paymentController.createPaymentIntent(new BigDecimal("100.00"));
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("client_secret_123", result.getBody());
        verify(paymentService).createPaymentIntent(new BigDecimal("100.00"));
    }

    @Test
    void createPaymentIntent_Failure() {
        when(paymentService.createPaymentIntent(any())).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<String> result = paymentController.createPaymentIntent(new BigDecimal("100.00"));
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        verify(paymentService).createPaymentIntent(new BigDecimal("100.00"));
    }

    @Test
    void refundPayment_Success() {
        PaymentResponse response = new PaymentResponse();
        response.setStatus("REFUNDED");
        
        when(paymentService.refundPayment(1L)).thenReturn(response);
        
        ResponseEntity<PaymentResponse> result = paymentController.refundPayment(1L);
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("REFUNDED", result.getBody().getStatus());
        verify(paymentService).refundPayment(1L);
    }

    @Test
    void refundPayment_Failure() {
        when(paymentService.refundPayment(1L)).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<PaymentResponse> result = paymentController.refundPayment(1L);
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        verify(paymentService).refundPayment(1L);
    }

    @Test
    void downloadReceipt_Success() throws Exception {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setCustomerUsername("user");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setOrderId(1L);
        
        byte[] pdfBytes = new byte[]{1, 2, 3};
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(pdfService.generateReceipt(payment)).thenReturn(pdfBytes);
        
        ResponseEntity<byte[]> result = paymentController.downloadReceipt(1L);
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertArrayEquals(pdfBytes, result.getBody());
        verify(pdfService).generateReceipt(payment);
    }

    @Test
    void downloadReceipt_PaymentNotFound() throws Exception {
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());
        
        ResponseEntity<byte[]> result = paymentController.downloadReceipt(1L);
        
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        verify(pdfService, never()).generateReceipt(any());
    }

    @Test
    void downloadReceipt_PdfGenerationError() throws Exception {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setCustomerUsername("user");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setOrderId(1L);
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(pdfService.generateReceipt(payment)).thenThrow(new java.io.IOException("PDF error"));
        
        ResponseEntity<byte[]> result = paymentController.downloadReceipt(1L);
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        verify(pdfService).generateReceipt(payment);
    }
}
