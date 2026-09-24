package com.carwash.payment.service;

import com.carwash.payment.dto.PaymentRequest;
import com.carwash.payment.dto.PaymentResponse;
import com.carwash.payment.entity.Payment;
import com.carwash.payment.exception.PaymentNotFoundException;
import com.carwash.payment.exception.PaymentProcessingException;
import com.carwash.payment.repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import com.stripe.model.checkout.Session;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void handleWebhook_Success() {
        assertDoesNotThrow(() -> paymentService.handleWebhook("payload", "signature"));
    }

    @Test
    void createCheckoutSession_Success() throws StripeException {
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setCustomerUsername("user");
        request.setAmount(new BigDecimal("50.00"));
        
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setOrderId(1L);
        payment.setCustomerUsername("user");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.PENDING);
        
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        
        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            Session mockSession = mock(Session.class);
            when(mockSession.getUrl()).thenReturn("https://checkout.stripe.com/session");
            sessionMock.when(() -> Session.create(any(com.stripe.param.checkout.SessionCreateParams.class))).thenReturn(mockSession);
            
            String url = paymentService.createCheckoutSession(request);
            
            assertEquals("https://checkout.stripe.com/session", url);
            verify(paymentRepository).save(any(Payment.class));
        }
    }

    @Test
    void createCheckoutSession_StripeException() throws StripeException {
        PaymentRequest request = new PaymentRequest();
        request.setOrderId(1L);
        request.setCustomerUsername("user");
        request.setAmount(new BigDecimal("50.00"));
        
        Payment payment = new Payment();
        payment.setId(1L);
        
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);
        
        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            sessionMock.when(() -> Session.create(any(com.stripe.param.checkout.SessionCreateParams.class))).thenThrow(new StripeException("Stripe error", "req_123", "code", 400) {});
            
            assertThrows(PaymentProcessingException.class, () -> paymentService.createCheckoutSession(request));
            verify(paymentRepository).save(any(Payment.class));
        }
    }

    @Test
    void getPaymentByOrderId_Success() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setOrderId(1L);
        payment.setCustomerUsername("user");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        
        when(paymentRepository.findByOrderId(1L)).thenReturn(Optional.of(payment));
        
        PaymentResponse response = paymentService.getPaymentByOrderId(1L);
        
        assertNotNull(response);
        assertEquals(1L, response.getOrderId());
        verify(paymentRepository).findByOrderId(1L);
    }

    @Test
    void getPaymentByOrderId_NotFound() {
        when(paymentRepository.findByOrderId(1L)).thenReturn(Optional.empty());
        
        assertThrows(PaymentNotFoundException.class, () -> paymentService.getPaymentByOrderId(1L));
        verify(paymentRepository).findByOrderId(1L);
    }

    @Test
    void getPaymentsByCustomer_Success() {
        Payment payment1 = new Payment();
        payment1.setId(1L);
        payment1.setOrderId(1L);
        payment1.setCustomerUsername("user");
        payment1.setAmount(new BigDecimal("50.00"));
        payment1.setStatus(Payment.PaymentStatus.COMPLETED);
        
        Payment payment2 = new Payment();
        payment2.setId(2L);
        payment2.setOrderId(2L);
        payment2.setCustomerUsername("user");
        payment2.setAmount(new BigDecimal("100.00"));
        payment2.setStatus(Payment.PaymentStatus.PENDING);
        
        when(paymentRepository.findByCustomerUsername("user")).thenReturn(Arrays.asList(payment1, payment2));
        
        List<PaymentResponse> responses = paymentService.getPaymentsByCustomer("user");
        
        assertEquals(2, responses.size());
        assertEquals(1L, responses.get(0).getOrderId());
        assertEquals(2L, responses.get(1).getOrderId());
        verify(paymentRepository).findByCustomerUsername("user");
    }

    @Test
    void getPaymentsByCustomer_Empty() {
        when(paymentRepository.findByCustomerUsername("user")).thenReturn(Arrays.asList());
        
        List<PaymentResponse> responses = paymentService.getPaymentsByCustomer("user");
        
        assertEquals(0, responses.size());
        verify(paymentRepository).findByCustomerUsername("user");
    }

    @Test
    void createPaymentIntent_Success() throws StripeException {
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            PaymentIntent mockIntent = mock(PaymentIntent.class);
            when(mockIntent.getClientSecret()).thenReturn("client_secret_123");
            paymentIntentMock.when(() -> PaymentIntent.create(any(com.stripe.param.PaymentIntentCreateParams.class))).thenReturn(mockIntent);
            
            String clientSecret = paymentService.createPaymentIntent(new BigDecimal("100.00"));
            
            assertEquals("client_secret_123", clientSecret);
        }
    }

    @Test
    void createPaymentIntent_StripeException() throws StripeException {
        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            paymentIntentMock.when(() -> PaymentIntent.create(any(com.stripe.param.PaymentIntentCreateParams.class))).thenThrow(new StripeException("Error", "req_123", "code", 400) {});
            
            assertThrows(PaymentProcessingException.class, () -> paymentService.createPaymentIntent(new BigDecimal("100.00")));
        }
    }

    @Test
    void refundPayment_Success() throws StripeException {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setOrderId(1L);
        payment.setCustomerUsername("user");
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setTransactionId("pi_123");
        
        Payment refundedPayment = new Payment();
        refundedPayment.setId(1L);
        refundedPayment.setStatus(Payment.PaymentStatus.REFUNDED);
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(refundedPayment);
        
        try (MockedStatic<Refund> refundMock = mockStatic(Refund.class)) {
            Refund mockRefund = mock(Refund.class);
            refundMock.when(() -> Refund.create(any(RefundCreateParams.class))).thenReturn(mockRefund);
            
            PaymentResponse response = paymentService.refundPayment(1L);
            
            assertNotNull(response);
            assertEquals("REFUNDED", response.getStatus());
            verify(paymentRepository).save(payment);
        }
    }

    @Test
    void refundPayment_NotFound() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(PaymentNotFoundException.class, () -> paymentService.refundPayment(1L));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    void refundPayment_NotCompleted() {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        
        assertThrows(PaymentProcessingException.class, () -> paymentService.refundPayment(1L));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    void refundPayment_StripeException() throws StripeException {
        Payment payment = new Payment();
        payment.setId(1L);
        payment.setAmount(new BigDecimal("50.00"));
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setTransactionId("pi_123");
        
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
        
        try (MockedStatic<Refund> refundMock = mockStatic(Refund.class)) {
            refundMock.when(() -> Refund.create(any(RefundCreateParams.class))).thenThrow(new StripeException("Error", "req_123", "code", 400) {});
            
            assertThrows(PaymentProcessingException.class, () -> paymentService.refundPayment(1L));
            verify(paymentRepository, never()).save(any());
        }
    }
}
