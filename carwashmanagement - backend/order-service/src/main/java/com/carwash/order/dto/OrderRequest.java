package com.carwash.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderRequest {
    private String customerUsername;
    private String licensePlate;
    private String carLicensePlate;
    private String serviceType;
    private BigDecimal amount;
    private BigDecimal totalAmount;
    private LocalDateTime scheduledTime;
    private LocalDateTime scheduledDateTime;
    private String address;
    private String customerAddress;
    private String specialInstructions;

    public OrderRequest() {
    }

    public OrderRequest(String customerUsername, String licensePlate, String carLicensePlate,
                        String serviceType, BigDecimal amount, BigDecimal totalAmount,
                        LocalDateTime scheduledTime, LocalDateTime scheduledDateTime,
                        String address, String customerAddress, String specialInstructions) {
        this.customerUsername = customerUsername;
        this.licensePlate = licensePlate;
        this.carLicensePlate = carLicensePlate;
        this.serviceType = serviceType;
        this.amount = amount;
        this.totalAmount = totalAmount;
        this.scheduledTime = scheduledTime;
        this.scheduledDateTime = scheduledDateTime;
        this.address = address;
        this.customerAddress = customerAddress;
        this.specialInstructions = specialInstructions;
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

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public LocalDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(LocalDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
