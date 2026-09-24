# Car Wash Management System - Code Documentation Guide

## Common Code Patterns & Explanations

### 1. Package Declaration
```java
package com.carwash.payment.controller;
```
- **Purpose**: Organizes classes into namespaces
- **Pattern**: Reverse domain naming (com.company.module.layer)
- **Benefit**: Prevents naming conflicts, logical organization

### 2. Import Statements
```java
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
```
- **Purpose**: Brings external classes into current file scope
- **Types**: 
  - Spring Framework annotations
  - Java standard library
  - Third-party libraries (Stripe, PDFBox)
  - Custom project classes

### 3. Class-Level Annotations

#### @RestController
```java
@RestController
public class PaymentController {
```
- **Purpose**: Marks class as REST API controller
- **Function**: Combines @Controller + @ResponseBody
- **Result**: Methods return data directly (JSON/XML)

#### @Service
```java
@Service
public class PaymentService {
```
- **Purpose**: Marks class as business logic layer
- **Function**: Spring component for service layer
- **Benefit**: Dependency injection, transaction management

#### @Repository
```java
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
```
- **Purpose**: Data access layer marker
- **Function**: Exception translation, persistence operations
- **Pattern**: Repository pattern for data abstraction

#### @Entity
```java
@Entity
@Table(name = "payments")
public class Payment {
```
- **Purpose**: JPA entity mapping to database table
- **Function**: ORM (Object-Relational Mapping)
- **Result**: Java object ↔ Database row mapping

### 4. Dependency Injection
```java
@Autowired
private PaymentService paymentService;
```
- **Purpose**: Inversion of Control (IoC)
- **Function**: Spring manages object creation/lifecycle
- **Benefit**: Loose coupling, testability, maintainability

### 5. Method-Level Annotations

#### @PostMapping
```java
@PostMapping("/create-checkout-session")
public ResponseEntity<String> createCheckoutSession(@RequestBody PaymentRequest request) {
```
- **Purpose**: Maps HTTP POST requests to method
- **Parameters**: URL path mapping
- **Function**: RESTful endpoint definition

#### @GetMapping
```java
@GetMapping("/{paymentId}/receipt")
public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long paymentId) {
```
- **Purpose**: Maps HTTP GET requests to method
- **Path Variables**: {paymentId} → @PathVariable Long paymentId
- **Function**: URL parameter extraction

#### @RequestBody
```java
public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest request) {
```
- **Purpose**: Deserializes HTTP request body to Java object
- **Function**: JSON → Java object conversion
- **Framework**: Jackson JSON processor

#### @PathVariable
```java
public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
```
- **Purpose**: Extracts URL path segments as method parameters
- **Example**: /orders/123 → orderId = 123
- **Type**: Automatic type conversion

#### @RequestParam
```java
public String paymentFailed(@RequestParam(value = "reason", defaultValue = "Unknown error") String reason) {
```
- **Purpose**: Extracts query parameters from URL
- **Example**: ?reason=declined → reason = "declined"
- **Features**: Default values, optional parameters

### 6. Exception Handling

#### Try-Catch Blocks
```java
try {
    PaymentResponse response = paymentService.processPayment(request);
    return ResponseEntity.ok(response);
} catch (PaymentNotFoundException e) {
    return ResponseEntity.notFound().build();
} catch (Exception e) {
    return ResponseEntity.badRequest().build();
}
```
- **Purpose**: Error handling and recovery
- **Pattern**: Specific exceptions first, general last
- **Result**: Graceful error responses

#### Custom Exceptions
```java
throw new PaymentNotFoundException("Payment not found");
```
- **Purpose**: Domain-specific error types
- **Benefit**: Clear error semantics, better debugging
- **Pattern**: Extends RuntimeException for unchecked exceptions

#### @ExceptionHandler
```java
@ExceptionHandler(PaymentNotFoundException.class)
public ResponseEntity<Map<String, Object>> handlePaymentNotFound(PaymentNotFoundException ex) {
```
- **Purpose**: Global exception handling
- **Function**: AOP (Aspect-Oriented Programming)
- **Benefit**: Centralized error handling across controllers

### 7. HTTP Response Patterns

#### ResponseEntity
```java
return ResponseEntity.ok(response);
return ResponseEntity.notFound().build();
return ResponseEntity.badRequest().build();
```
- **Purpose**: Full control over HTTP response
- **Components**: Status code, headers, body
- **Benefit**: RESTful API standards compliance

#### HTTP Status Codes
- **200 OK**: Successful GET, PUT
- **201 Created**: Successful POST
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Authentication required
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server-side error

### 8. Data Transfer Objects (DTOs)

#### Request DTOs
```java
public class PaymentRequest {
    private Long orderId;
    private String customerUsername;
    private BigDecimal amount;
}
```
- **Purpose**: Data transfer between layers
- **Benefit**: Input validation, API versioning
- **Pattern**: Separate from entity classes

#### Response DTOs
```java
public class PaymentResponse {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
}
```
- **Purpose**: Control data exposure in API responses
- **Benefit**: Security, backward compatibility
- **Pattern**: Only expose necessary fields

### 9. JPA/Database Patterns

#### Entity Relationships
```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(nullable = false)
private String customerUsername;

@Enumerated(EnumType.STRING)
private PaymentStatus status;
```
- **@Id**: Primary key marker
- **@GeneratedValue**: Auto-increment strategy
- **@Column**: Column constraints and mapping
- **@Enumerated**: Enum to string/ordinal mapping

#### Repository Methods
```java
Optional<Payment> findByOrderId(Long orderId);
List<Payment> findByCustomerUsername(String username);
```
- **Purpose**: Query method generation from method names
- **Pattern**: findBy + PropertyName
- **Return Types**: Optional for single results, List for multiple

#### Optional Pattern
```java
Payment payment = paymentRepository.findById(paymentId)
    .orElseThrow(() -> new PaymentNotFoundException("Payment not found"));
```
- **Purpose**: Safe null handling
- **Methods**: orElse(), orElseGet(), orElseThrow()
- **Benefit**: Prevents NullPointerException

### 10. Stream API & Functional Programming

#### Stream Operations
```java
return payments.stream()
    .map(this::mapToResponse)
    .collect(Collectors.toList());
```
- **stream()**: Creates stream from collection
- **map()**: Transforms each element
- **collect()**: Terminal operation to gather results
- **Method Reference**: this::mapToResponse

#### Lambda Expressions
```java
.orElseGet(() -> {
    Payment newPayment = new Payment();
    return newPayment;
})
```
- **Purpose**: Anonymous function implementation
- **Syntax**: (parameters) -> { body }
- **Benefit**: Concise code, functional programming

### 11. Builder Pattern
```java
SessionCreateParams params = SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .setSuccessUrl("http://localhost:8085/payments/payment-success")
    .build();
```
- **Purpose**: Fluent object construction
- **Pattern**: Method chaining
- **Benefit**: Readable, flexible object creation

### 12. Enum Usage
```java
public enum PaymentStatus {
    PENDING, COMPLETED, FAILED, REFUNDED
}

payment.setStatus(Payment.PaymentStatus.PENDING);
```
- **Purpose**: Type-safe constants
- **Benefit**: Compile-time checking, clear semantics
- **Usage**: Status tracking, configuration options

### 13. Validation Patterns
```java
if (request.getPaymentMethodId() == null || request.getPaymentMethodId().isEmpty()) {
    // Handle null/empty case
}
```
- **Purpose**: Input validation and null safety
- **Pattern**: Guard clauses, early returns
- **Benefit**: Prevents runtime errors

### 14. Configuration Properties
```properties
server.port=8080
spring.application.name=api-gateway
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```
- **Purpose**: External configuration
- **Pattern**: Key-value pairs
- **Benefit**: Environment-specific settings

### 15. Microservices Patterns

#### Service Discovery
```java
@EnableDiscoveryClient
public class ApiGatewayApplication {
```
- **Purpose**: Register with Eureka server
- **Function**: Service location transparency
- **Benefit**: Dynamic service discovery

#### Load Balancing
```properties
spring.cloud.gateway.routes[1].uri=lb://car-service
```
- **lb://**: Load balancer prefix
- **Function**: Distribute requests across instances
- **Benefit**: High availability, scalability

### 16. Security Patterns

#### JWT Token Handling
```java
String jwtToken = token.substring(7); // Remove "Bearer " prefix
String role = jwtUtil.extractRole(jwtToken);
```
- **Purpose**: Stateless authentication
- **Pattern**: Bearer token in Authorization header
- **Function**: Extract user information from token

#### Role-Based Access Control
```java
if (!\"CUSTOMER\".equals(role) && !\"ADMIN\".equals(role)) {
    return ResponseEntity.status(403).body(\"Access denied\");
}
```
- **Purpose**: Authorization based on user roles
- **Pattern**: Role checking before business logic
- **Result**: HTTP 403 Forbidden for unauthorized access

This documentation covers the major patterns and concepts used throughout the Car Wash Management System. Each pattern serves specific purposes in building a maintainable, scalable microservices architecture.