package com.carwash.payment.dto;

import java.math.BigDecimal;

public class PaymentRequest {
    private Long orderId;
    private String customerUsername;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentMethodId;
    private String successUrl;
    private String cancelUrl;

    public PaymentRequest() {
    }

    public PaymentRequest(Long orderId, String customerUsername, BigDecimal amount,
                          String paymentMethod, String paymentMethodId, String successUrl, String cancelUrl) {
        this.orderId = orderId;
        this.customerUsername = customerUsername;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentMethodId = paymentMethodId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCustomerUsername() {
        return customerUsername;
    }

    public void setCustomerUsername(String customerUsername) {
        this.customerUsername = customerUsername;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }
}
