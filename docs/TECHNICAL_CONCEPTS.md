# Car Wash Management System - Technical Concepts

## Architecture Patterns

### 1. Microservices Architecture
- **Service Registry (Eureka)**: Service discovery and registration
- **API Gateway**: Single entry point, routing, load balancing
- **Independent Services**: Auth, Car, Order, Payment services
- **Database per Service**: Each service has its own MySQL database

### 2. Spring Boot Concepts

#### Dependency Injection
```java
@Autowired
private PaymentRepository paymentRepository; // Constructor/Field injection
```

#### Annotations
- `@RestController`: REST API endpoints
- `@Service`: Business logic layer
- `@Repository`: Data access layer
- `@Entity`: JPA entity mapping
- `@Configuration`: Configuration classes

#### Spring Cloud
- `@EnableDiscoveryClient`: Eureka client registration
- `@EnableEurekaServer`: Service registry server
- Load balancing with `lb://service-name`

### 3. Data Persistence (JPA/Hibernate)

#### Entity Mapping
```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // Enum mapping
}
```

#### Repository Pattern
```java
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId); // Query methods
}
```

### 4. Security Concepts

#### JWT Authentication
- Token-based stateless authentication
- Claims-based authorization
- Token validation in API Gateway

#### Password Encryption
```java
@Autowired
private PasswordEncoder passwordEncoder; // BCrypt hashing
```

### 5. Exception Handling

#### Custom Exceptions
```java
public class PaymentNotFoundException extends RuntimeException {
    // Domain-specific exceptions
}
```

#### Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(PaymentNotFoundException.class)
    // Centralized error handling
}
```

### 6. Design Patterns

#### DTO Pattern (Data Transfer Object)
```java
public class PaymentRequest {
    // Separate request/response objects from entities
}
```

#### Builder Pattern
```java
SessionCreateParams.builder()
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .build(); // Stripe API usage
```

#### Repository Pattern
- Abstraction over data access
- Separation of concerns

### 7. RESTful API Design

#### HTTP Methods
- `GET`: Retrieve data
- `POST`: Create resources
- `PUT`: Update resources
- `DELETE`: Remove resources

#### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

### 8. Third-Party Integration

#### Stripe Payment Gateway
- Payment processing
- Webhook handling
- Session management

### 9. Configuration Management

#### Application Properties
```properties
server.port=8080
spring.application.name=api-gateway
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

#### Environment-specific configs
- Development, staging, production profiles

### 10. Database Concepts

#### Relational Database Design
- Primary keys, foreign keys
- Entity relationships
- Data normalization

#### Connection Pooling
- Efficient database connections
- HikariCP (default in Spring Boot)

### 11. Logging and Monitoring

#### SLF4J Logging
```java
private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
```

#### Actuator Endpoints
- Health checks
- Metrics
- Application info

### 12. Validation

#### Bean Validation
```java
@NotNull
@Size(min = 1, max = 50)
private String username; // Input validation
```

### 13. Functional Programming

#### Stream API
```java
return payments.stream()
    .map(this::mapToResponse)
    .collect(Collectors.toList()); // Functional transformations
```

#### Optional
```java
Optional<Payment> payment = repository.findById(id);
payment.orElseThrow(() -> new PaymentNotFoundException("Not found"));
```

### 14. Concurrency

#### Thread Safety
- Stateless services
- Immutable objects where possible
- Proper synchronization

### 15. Testing Concepts

#### Unit Testing
- JUnit 5
- Mockito for mocking
- Test-driven development

#### Integration Testing
- @SpringBootTest
- TestContainers for database testing

### 16. DevOps Concepts

#### Containerization
- Docker containers
- Container orchestration

#### CI/CD Pipeline
- Automated testing
- Deployment automation

### 17. API Documentation

#### OpenAPI/Swagger
- API specification
- Interactive documentation

### 18. Caching

#### Spring Cache
- Method-level caching
- Cache providers (Redis, Ehcache)

### 19. Message Queuing

#### Asynchronous Processing
- RabbitMQ/Apache Kafka
- Event-driven architecture

### 20. Monitoring and Observability

#### Distributed Tracing
- Spring Cloud Sleuth
- Zipkin integration

#### Metrics Collection
- Micrometer
- Prometheus integration

## Key Benefits

1. **Scalability**: Independent service scaling
2. **Maintainability**: Separation of concerns
3. **Reliability**: Fault isolation
4. **Security**: Centralized authentication
5. **Performance**: Optimized data access
6. **Monitoring**: Comprehensive observability
7. **Testing**: Isolated unit testing
8. **Deployment**: Independent deployments