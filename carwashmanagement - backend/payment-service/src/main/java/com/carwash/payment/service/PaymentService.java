// Service for payment processing business logic
package com.carwash.payment.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.carwash.payment.dto.PaymentRequest;
import com.carwash.payment.dto.PaymentResponse;
import com.carwash.payment.entity.Payment;
import com.carwash.payment.repository.PaymentRepository;
import com.carwash.payment.exception.PaymentNotFoundException;
import com.carwash.payment.exception.PaymentProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    
    private static final BigDecimal TAX_RATE = new BigDecimal("0.08"); // 8% tax

    @Autowired
    private PaymentRepository paymentRepository;
    
    public void handleWebhook(String payload, String sigHeader) {
        System.out.println("Webhook received: " + payload);
    }

    public PaymentResponse verifyAndCompletePayment(String sessionId) {
        try {
            Session session = Session.retrieve(sessionId);
            if ("complete".equals(session.getStatus()) || "paid".equals(session.getPaymentStatus())) {
                String paymentId = session.getMetadata().get("paymentId");
                Payment payment = paymentRepository.findById(Long.parseLong(paymentId))
                        .orElseThrow(() -> new PaymentNotFoundException("Payment not found"));
                if (payment.getStatus() == Payment.PaymentStatus.PENDING) {
                    payment.setStatus(Payment.PaymentStatus.COMPLETED);
                    payment.setTransactionId(session.getPaymentIntent());
                    payment.setPaymentMethod("stripe");
                    payment.setUpdatedAt(LocalDateTime.now());
                    payment = paymentRepository.save(payment);
                }
                return mapToResponse(payment);
            }
            throw new PaymentProcessingException("Payment not completed");
        } catch (StripeException e) {
            throw new PaymentProcessingException("Failed to verify payment: " + e.getMessage());
        }
    }
    
    public String createCheckoutSession(PaymentRequest request) {
        BigDecimal taxAmount = request.getAmount().multiply(TAX_RATE).setScale(2, java.math.RoundingMode.HALF_UP);
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setCustomerUsername(request.getCustomerUsername());
        payment.setAmount(request.getAmount());
        payment.setTaxAmount(taxAmount);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment = paymentRepository.save(payment);
        
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(request.getSuccessUrl() != null ? request.getSuccessUrl() : "http://localhost:3000/payments?success=true&session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(request.getCancelUrl() != null ? request.getCancelUrl() : "http://localhost:3000/payments?cancelled=true")
                    .addLineItem(
                        SessionCreateParams.LineItem.builder()
                            .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(request.getAmount().multiply(new BigDecimal("100")).longValue())
                                    .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Car Wash Service - Order #" + request.getOrderId())
                                            .build()
                                    )
                                    .build()
                            )
                            .setQuantity(1L)
                            .build()
                    )
                    .putMetadata("orderId", request.getOrderId().toString())
                    .putMetadata("paymentId", payment.getId().toString())
                    .build();
            
            Session session = Session.create(params);
            return session.getUrl();
        } catch (StripeException e) {
            throw new PaymentProcessingException("Failed to create checkout session: " + e.getMessage());
        }
    }
    
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found"));
        return mapToResponse(payment);
    }
    
    public List<PaymentResponse> getPaymentsByCustomer(String customerUsername) {
        return paymentRepository.findByCustomerUsername(customerUsername).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public String createPaymentIntent(BigDecimal amount) {
        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount.multiply(new BigDecimal("100")).longValue())
                    .setCurrency("usd")
                    .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                            .setEnabled(true)
                            .build()
                    )
                    .build();
            
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return paymentIntent.getClientSecret();
        } catch (StripeException e) {
            throw new PaymentProcessingException("Failed to create payment intent: " + e.getMessage());
        }
    }
    
    public PaymentResponse refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new PaymentProcessingException("Only completed payments can be refunded");
        }

        try {
            // Refund amount = paid amount - tax (customer bears the tax)
            BigDecimal taxAmount = payment.getTaxAmount() != null
                    ? payment.getTaxAmount()
                    : payment.getAmount().multiply(TAX_RATE).setScale(2, java.math.RoundingMode.HALF_UP);
            BigDecimal refundAmount = payment.getAmount().subtract(taxAmount).setScale(2, java.math.RoundingMode.HALF_UP);

            // Create Stripe refund with partial amount
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(payment.getTransactionId())
                    .setAmount(refundAmount.multiply(new BigDecimal("100")).longValue())
                    .build();
            Refund.create(params);

            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            payment.setTaxAmount(taxAmount);
            payment.setRefundAmount(refundAmount);
            payment.setUpdatedAt(LocalDateTime.now());
            payment = paymentRepository.save(payment);
        } catch (StripeException e) {
            throw new PaymentProcessingException("Refund failed: " + e.getMessage());
        }

        return mapToResponse(payment);
    }

    public PaymentResponse refundByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("No payment found for order #" + orderId));
        return refundPayment(payment.getId());
    }
    
    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrderId());
        response.setCustomerUsername(payment.getCustomerUsername());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus().name());
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setServiceType(payment.getServiceType());
        response.setTaxAmount(payment.getTaxAmount());
        response.setRefundAmount(payment.getRefundAmount());
        response.setCreatedAt(payment.getCreatedAt());
        response.setUpdatedAt(payment.getUpdatedAt());
        return response;
    }
}
