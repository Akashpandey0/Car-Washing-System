package com.carwash.order.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerUsername;

    @Column(nullable = false)
    private String carLicensePlate;

    @Column(nullable = false)
    private String serviceType;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private String washerUsername;

    @Column(nullable = false)
    private LocalDateTime scheduledDateTime;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    private String customerAddress;
    private String specialInstructions;

    public enum OrderStatus {
        PENDING,
        ASSIGNED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        PAID
    }

    public Order() {
    }

    public Order(Long id, String customerUsername, String carLicensePlate, String serviceType,
                 BigDecimal totalAmount, OrderStatus status, String washerUsername,
                 LocalDateTime scheduledDateTime, LocalDateTime createdAt, LocalDateTime updatedAt,
                 String customerAddress, String specialInstructions) {
        this.id = id;
        this.customerUsername = customerUsername;
        this.carLicensePlate = carLicensePlate;
        this.serviceType = serviceType;
        this.totalAmount = totalAmount;
        this.status = status;
        this.washerUsername = washerUsername;
        this.scheduledDateTime = scheduledDateTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customerAddress = customerAddress;
        this.specialInstructions = specialInstructions;
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

    public String getCarLicensePlate() {
        return carLicensePlate;
    }

    public void setCarLicensePlate(String carLicensePlate) {
        this.carLicensePlate = carLicensePlate;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getWasherUsername() {
        return washerUsername;
    }

    public void setWasherUsername(String washerUsername) {
        this.washerUsername = washerUsername;
    }

    public LocalDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(LocalDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
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

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
}
