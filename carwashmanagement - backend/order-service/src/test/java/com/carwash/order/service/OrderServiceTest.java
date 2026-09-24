package com.carwash.order.service;

import com.carwash.order.dto.OrderRequest;
import com.carwash.order.dto.OrderResponse;
import com.carwash.order.entity.Order;
import com.carwash.order.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_Success() {
        OrderRequest request = new OrderRequest();
        request.setCustomerUsername("user");
        request.setCarLicensePlate("ABC123");
        request.setServiceType("BASIC_WASH");
        request.setTotalAmount(new BigDecimal("50.00"));
        request.setScheduledDateTime(LocalDateTime.now());
        request.setCustomerAddress("123 Main St");
        
        Order order = new Order();
        order.setId(1L);
        order.setCustomerUsername("user");
        order.setCarLicensePlate("ABC123");
        order.setServiceType("BASIC_WASH");
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(Order.OrderStatus.PENDING);
        
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        
        OrderResponse response = orderService.createOrder(request);
        
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("user", response.getCustomerUsername());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_WithLicensePlate() {
        OrderRequest request = new OrderRequest();
        request.setCustomerUsername("user");
        request.setLicensePlate("XYZ789");
        request.setServiceType("PREMIUM_WASH");
        request.setAmount(new BigDecimal("100.00"));
        request.setScheduledTime(LocalDateTime.now());
        request.setAddress("456 Oak Ave");
        
        Order order = new Order();
        order.setId(1L);
        order.setCarLicensePlate("XYZ789");
        
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        
        OrderResponse response = orderService.createOrder(request);
        
        assertNotNull(response);
        assertEquals("XYZ789", response.getLicensePlate());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void getOrdersByCustomer_Success() {
        Order order1 = new Order();
        order1.setId(1L);
        order1.setCustomerUsername("user");
        order1.setCarLicensePlate("ABC123");
        order1.setServiceType("BASIC_WASH");
        order1.setTotalAmount(new BigDecimal("50.00"));
        order1.setStatus(Order.OrderStatus.PENDING);
        
        Order order2 = new Order();
        order2.setId(2L);
        order2.setCustomerUsername("user");
        order2.setCarLicensePlate("XYZ789");
        order2.setServiceType("PREMIUM_WASH");
        order2.setTotalAmount(new BigDecimal("100.00"));
        order2.setStatus(Order.OrderStatus.COMPLETED);
        
        when(orderRepository.findByCustomerUsername("user")).thenReturn(Arrays.asList(order1, order2));
        
        List<OrderResponse> responses = orderService.getOrdersByCustomer("user");
        
        assertEquals(2, responses.size());
        assertEquals("ABC123", responses.get(0).getLicensePlate());
        assertEquals("XYZ789", responses.get(1).getLicensePlate());
        verify(orderRepository).findByCustomerUsername("user");
    }

    @Test
    void getOrdersByCustomer_Empty() {
        when(orderRepository.findByCustomerUsername("user")).thenReturn(Arrays.asList());
        
        List<OrderResponse> responses = orderService.getOrdersByCustomer("user");
        
        assertEquals(0, responses.size());
        verify(orderRepository).findByCustomerUsername("user");
    }

    @Test
    void getOrdersByWasher_Success() {
        Order order1 = new Order();
        order1.setId(1L);
        order1.setWasherUsername("washer");
        order1.setCarLicensePlate("ABC123");
        order1.setServiceType("BASIC_WASH");
        order1.setTotalAmount(new BigDecimal("50.00"));
        order1.setStatus(Order.OrderStatus.ASSIGNED);
        
        when(orderRepository.findByWasherUsername("washer")).thenReturn(Arrays.asList(order1));
        
        List<OrderResponse> responses = orderService.getOrdersByWasher("washer");
        
        assertEquals(1, responses.size());
        assertEquals("washer", responses.get(0).getWasherUsername());
        verify(orderRepository).findByWasherUsername("washer");
    }

    @Test
    void getOrdersByWasher_Empty() {
        when(orderRepository.findByWasherUsername("washer")).thenReturn(Arrays.asList());
        
        List<OrderResponse> responses = orderService.getOrdersByWasher("washer");
        
        assertEquals(0, responses.size());
        verify(orderRepository).findByWasherUsername("washer");
    }

    @Test
    void getOrderById_Success() {
        Order order = new Order();
        order.setId(1L);
        order.setCustomerUsername("user");
        order.setCarLicensePlate("ABC123");
        order.setServiceType("BASIC_WASH");
        order.setTotalAmount(new BigDecimal("50.00"));
        order.setStatus(Order.OrderStatus.PENDING);
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        
        OrderResponse response = orderService.getOrderById(1L);
        
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("ABC123", response.getLicensePlate());
        verify(orderRepository).findById(1L);
    }

    @Test
    void getOrderById_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> orderService.getOrderById(1L));
        verify(orderRepository).findById(1L);
    }

    @Test
    void updateOrderStatus_Success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCustomerUsername("user");
        order.setCarLicensePlate("ABC123");
        order.setServiceType("BASIC_WASH");
        order.setTotalAmount(new BigDecimal("50.00"));
        
        Order updatedOrder = new Order();
        updatedOrder.setId(1L);
        updatedOrder.setStatus(Order.OrderStatus.COMPLETED);
        updatedOrder.setCustomerUsername("user");
        updatedOrder.setCarLicensePlate("ABC123");
        updatedOrder.setServiceType("BASIC_WASH");
        updatedOrder.setTotalAmount(new BigDecimal("50.00"));
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(updatedOrder);
        
        OrderResponse response = orderService.updateOrderStatus(1L, "COMPLETED");
        
        assertNotNull(response);
        assertEquals("COMPLETED", response.getStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void updateOrderStatus_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> orderService.updateOrderStatus(1L, "COMPLETED"));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void assignWasher_Success() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCustomerUsername("user");
        order.setCarLicensePlate("ABC123");
        order.setServiceType("BASIC_WASH");
        order.setTotalAmount(new BigDecimal("50.00"));
        
        Order assignedOrder = new Order();
        assignedOrder.setId(1L);
        assignedOrder.setWasherUsername("washer");
        assignedOrder.setStatus(Order.OrderStatus.ASSIGNED);
        assignedOrder.setCustomerUsername("user");
        assignedOrder.setCarLicensePlate("ABC123");
        assignedOrder.setServiceType("BASIC_WASH");
        assignedOrder.setTotalAmount(new BigDecimal("50.00"));
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(assignedOrder);
        
        OrderResponse response = orderService.assignWasher(1L, "washer");
        
        assertNotNull(response);
        assertEquals("washer", response.getWasherUsername());
        assertEquals("ASSIGNED", response.getStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void assignWasher_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        
        assertThrows(RuntimeException.class, () -> orderService.assignWasher(1L, "washer"));
        verify(orderRepository, never()).save(any());
    }

    @Test
    void getAllOrders_Success() {
        Order order1 = new Order();
        order1.setId(1L);
        order1.setCustomerUsername("user1");
        order1.setCarLicensePlate("ABC123");
        order1.setServiceType("BASIC_WASH");
        order1.setTotalAmount(new BigDecimal("50.00"));
        order1.setStatus(Order.OrderStatus.PENDING);
        
        Order order2 = new Order();
        order2.setId(2L);
        order2.setCustomerUsername("user2");
        order2.setCarLicensePlate("XYZ789");
        order2.setServiceType("PREMIUM_WASH");
        order2.setTotalAmount(new BigDecimal("100.00"));
        order2.setStatus(Order.OrderStatus.COMPLETED);
        
        when(orderRepository.findAll()).thenReturn(Arrays.asList(order1, order2));
        
        List<OrderResponse> responses = orderService.getAllOrders();
        
        assertEquals(2, responses.size());
        verify(orderRepository).findAll();
    }

    @Test
    void getAllOrders_Empty() {
        when(orderRepository.findAll()).thenReturn(Arrays.asList());
        
        List<OrderResponse> responses = orderService.getAllOrders();
        
        assertEquals(0, responses.size());
        verify(orderRepository).findAll();
    }
}
