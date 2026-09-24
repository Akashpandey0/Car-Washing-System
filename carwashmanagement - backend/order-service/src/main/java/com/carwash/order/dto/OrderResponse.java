package com.carwash.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponse {
    private Long id;
    private String customerUsername;
    private String licensePlate;
    private String serviceType;
    private BigDecimal amount;
    private String status;
    private String washerUsername;
    private LocalDateTime scheduledTime;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {
    }

    public OrderResponse(Long id, String customerUsername, String licensePlate, String serviceType,
                         BigDecimal amount, String status, String washerUsername,
                         LocalDateTime scheduledTime, String address,
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.customerUsername = customerUsername;
        this.licensePlate = licensePlate;
        this.serviceType = serviceType;
        this.amount = amount;
        this.status = status;
        this.washerUsername = washerUsername;
        this.scheduledTime = scheduledTime;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerUsername() {
        return customerUsername;
    }

    public void setCustomerUsername(String customerUsername) {
        this.customerUsername = customerUsername;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getWasherUsername() {
        return washerUsername;
    }

    public void setWasherUsername(String washerUsername) {
        this.washerUsername = washerUsername;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
