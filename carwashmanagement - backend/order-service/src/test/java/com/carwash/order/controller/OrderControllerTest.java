package com.carwash.order.controller;

import com.carwash.order.dto.OrderRequest;
import com.carwash.order.dto.OrderResponse;
import com.carwash.order.service.OrderService;
import com.carwash.order.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private OrderController orderController;

    @Test
    void createOrder_CustomerSuccess() {
        OrderRequest request = new OrderRequest();
        OrderResponse response = new OrderResponse();
        
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(orderService.createOrder(any())).thenReturn(response);
        
        ResponseEntity<?> result = orderController.createOrder(request, "Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(orderService).createOrder(request);
    }

    @Test
    void createOrder_AdminSuccess() {
        OrderRequest request = new OrderRequest();
        OrderResponse response = new OrderResponse();
        
        when(jwtUtil.extractRole("token")).thenReturn("ADMIN");
        when(jwtUtil.extractUsername("token")).thenReturn("admin");
        when(orderService.createOrder(any())).thenReturn(response);
        
        ResponseEntity<?> result = orderController.createOrder(request, "Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(orderService).createOrder(request);
    }

    @Test
    void createOrder_WasherForbidden() {
        OrderRequest request = new OrderRequest();
        
        when(jwtUtil.extractRole("token")).thenReturn("WASHER");
        when(jwtUtil.extractUsername("token")).thenReturn("washer");
        
        ResponseEntity<?> result = orderController.createOrder(request, "Bearer token");
        
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        verify(orderService, never()).createOrder(any());
    }

    @Test
    void createOrder_Exception() {
        OrderRequest request = new OrderRequest();
        
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(orderService.createOrder(any())).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<?> result = orderController.createOrder(request, "Bearer token");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertTrue(result.getBody().toString().contains("Error"));
    }

    @Test
    void getOrdersByCustomer_CustomerSuccess() {
        OrderResponse order1 = new OrderResponse();
        OrderResponse order2 = new OrderResponse();
        List<OrderResponse> orders = Arrays.asList(order1, order2);
        
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(orderService.getOrdersByCustomer("user")).thenReturn(orders);
        
        ResponseEntity<?> result = orderController.getOrdersByCustomer("Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(orderService).getOrdersByCustomer("user");
    }

    @Test
    void getOrdersByCustomer_AdminSuccess() {
        OrderResponse order1 = new OrderResponse();
        List<OrderResponse> orders = Arrays.asList(order1);
        
        when(jwtUtil.extractRole("token")).thenReturn("ADMIN");
        when(jwtUtil.extractUsername("token")).thenReturn("admin");
        when(orderService.getOrdersByCustomer("admin")).thenReturn(orders);
        
        ResponseEntity<?> result = orderController.getOrdersByCustomer("Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(orderService).getOrdersByCustomer("admin");
    }

    @Test
    void getOrdersByCustomer_WasherForbidden() {
        when(jwtUtil.extractRole("token")).thenReturn("WASHER");
        when(jwtUtil.extractUsername("token")).thenReturn("washer");
        
        ResponseEntity<?> result = orderController.getOrdersByCustomer("Bearer token");
        
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        verify(orderService, never()).getOrdersByCustomer(any());
    }

    @Test
    void getOrdersByCustomer_Exception() {
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        when(orderService.getOrdersByCustomer("user")).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<?> result = orderController.getOrdersByCustomer("Bearer token");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
    }

    @Test
    void getOrdersByWasher_WasherSuccess() {
        OrderResponse order1 = new OrderResponse();
        List<OrderResponse> orders = Arrays.asList(order1);
        
        when(jwtUtil.extractRole("token")).thenReturn("WASHER");
        when(jwtUtil.extractUsername("token")).thenReturn("washer");
        when(orderService.getOrdersByWasher("washer")).thenReturn(orders);
        
        ResponseEntity<?> result = orderController.getOrdersByWasher("Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(orderService).getOrdersByWasher("washer");
    }

    @Test
    void getOrdersByWasher_AdminSuccess() {
        OrderResponse order1 = new OrderResponse();
        List<OrderResponse> orders = Arrays.asList(order1);
        
        when(jwtUtil.extractRole("token")).thenReturn("ADMIN");
        when(jwtUtil.extractUsername("token")).thenReturn("admin");
        when(orderService.getOrdersByWasher("admin")).thenReturn(orders);
        
        ResponseEntity<?> result = orderController.getOrdersByWasher("Bearer token");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(orderService).getOrdersByWasher("admin");
    }

    @Test
    void getOrdersByWasher_CustomerForbidden() {
        when(jwtUtil.extractRole("token")).thenReturn("CUSTOMER");
        when(jwtUtil.extractUsername("token")).thenReturn("user");
        
        ResponseEntity<?> result = orderController.getOrdersByWasher("Bearer token");
        
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        verify(orderService, never()).getOrdersByWasher(any());
    }

    @Test
    void getOrdersByWasher_Exception() {
        when(jwtUtil.extractRole("token")).thenReturn("WASHER");
        when(jwtUtil.extractUsername("token")).thenReturn("washer");
        when(orderService.getOrdersByWasher("washer")).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<?> result = orderController.getOrdersByWasher("Bearer token");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
    }

    @Test
    void getOrderById_Success() {
        OrderResponse response = new OrderResponse();
        response.setId(1L);
        
        when(orderService.getOrderById(1L)).thenReturn(response);
        
        ResponseEntity<OrderResponse> result = orderController.getOrderById(1L);
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1L, result.getBody().getId());
        verify(orderService).getOrderById(1L);
    }

    @Test
    void getOrderById_NotFound() {
        when(orderService.getOrderById(1L)).thenThrow(new RuntimeException("Not found"));
        
        ResponseEntity<OrderResponse> result = orderController.getOrderById(1L);
        
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        verify(orderService).getOrderById(1L);
    }

    @Test
    void updateOrderStatus_Success() {
        OrderResponse response = new OrderResponse();
        response.setStatus("COMPLETED");
        
        when(orderService.updateOrderStatus(1L, "COMPLETED")).thenReturn(response);
        
        ResponseEntity<OrderResponse> result = orderController.updateOrderStatus(1L, "COMPLETED");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("COMPLETED", result.getBody().getStatus());
        verify(orderService).updateOrderStatus(1L, "COMPLETED");
    }

    @Test
    void updateOrderStatus_Failure() {
        when(orderService.updateOrderStatus(1L, "INVALID")).thenThrow(new RuntimeException("Invalid status"));
        
        ResponseEntity<OrderResponse> result = orderController.updateOrderStatus(1L, "INVALID");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        verify(orderService).updateOrderStatus(1L, "INVALID");
    }

    @Test
    void assignWasher_Success() {
        OrderResponse response = new OrderResponse();
        response.setWasherUsername("washer");
        
        when(orderService.assignWasher(1L, "washer")).thenReturn(response);
        
        ResponseEntity<OrderResponse> result = orderController.assignWasher(1L, "washer");
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("washer", result.getBody().getWasherUsername());
        verify(orderService).assignWasher(1L, "washer");
    }

    @Test
    void assignWasher_Failure() {
        when(orderService.assignWasher(1L, "washer")).thenThrow(new RuntimeException("Order not found"));
        
        ResponseEntity<OrderResponse> result = orderController.assignWasher(1L, "washer");
        
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        verify(orderService).assignWasher(1L, "washer");
    }

    @Test
    void getAllOrders_Success() {
        OrderResponse order1 = new OrderResponse();
        OrderResponse order2 = new OrderResponse();
        List<OrderResponse> orders = Arrays.asList(order1, order2);
        
        when(orderService.getAllOrders()).thenReturn(orders);
        
        ResponseEntity<List<OrderResponse>> result = orderController.getAllOrders();
        
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());
        verify(orderService).getAllOrders();
    }
}
