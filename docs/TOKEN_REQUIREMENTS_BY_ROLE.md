# Token Requirements by Role - Car Wash Management System

## Overview
This document details which endpoints require authentication tokens and which role tokens are needed for each endpoint.

## Base URL
```
http://localhost:8080
```

## Roles in the System
- **ADMIN**: Full system access, user management, analytics
- **CUSTOMER**: Can book services, manage cars, make payments
- **WASHER**: Can accept orders, update service status
- **PUBLIC**: No authentication required

---

## Token Requirements Summary

### 🟢 PUBLIC Endpoints (No Token Required)

#### Auth Service (`/api/auth/**`)
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/api/auth/register/CUSTOMER` | POST | ❌ No | Register new customer |
| `/api/auth/register/WASHER` | POST | ❌ No | Register new washer |
| `/api/auth/login/CUSTOMER` | POST | ❌ No | Customer login |
| `/api/auth/login/WASHER` | POST | ❌ No | Washer login |
| `/api/auth/login/ADMIN` | POST | ❌ No | Admin login |
| `/api/auth/validate` | GET | ❌ No | Validate token |
| `/api/auth/delete/{role}` | DELETE | ❌ No | Delete user (requires credentials in body) |

#### Car Service (`/cars/**`)
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/cars/owner/{username}` | GET | ❌ No | Get cars by owner |
| `/cars/{licensePlate}` | GET | ❌ No | Get car by license plate |
| `/cars` | GET | ❌ No | Get all cars (admin function) |
| `/cars/{licensePlate}` | PUT | ❌ No | Update car details |

#### Order Service (`/orders/**`)
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/orders/{id}` | GET | ❌ No | Get order by ID |
| `/orders` | GET | ❌ No | Get all orders (admin function) |
| `/orders/washer/{username}` | GET | ❌ No | Get orders by washer |
| `/orders/{id}/status` | PUT | ❌ No | Update order status |
| `/orders/{id}/assign` | PUT | ❌ No | Assign washer to order |

#### Payment Service (`/payments/**`)
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/payments/create-checkout-session` | POST | ❌ No | Create Stripe checkout |
| `/payments/payment-success` | GET | ❌ No | Payment success page |
| `/payments/payment-cancel` | GET | ❌ No | Payment cancel page |
| `/payments/payment-failed` | GET | ❌ No | Payment failed page |
| `/payments/webhook` | POST | ❌ No | Stripe webhook |
| `/payments/process` | POST | ❌ No | Process payment |
| `/payments/order/{orderId}` | GET | ❌ No | Get payment by order ID |
| `/payments/customer/{username}` | GET | ❌ No | Get payments by customer |
| `/payments/client-secret` | GET | ❌ No | Create payment intent |
| `/payments/{paymentId}/refund` | POST | ❌ No | Refund payment |
| `/payments/{paymentId}/receipt` | GET | ❌ No | Download receipt PDF |

---

### 🔴 ADMIN Role Endpoints (ADMIN Token Required)

#### Auth Service
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/api/auth/admin/register/{role}` | POST | ✅ ADMIN | Admin registers new user |

#### Car Service
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/cars` | POST | ✅ ADMIN or CUSTOMER | Register new car |

#### Order Service
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/orders` | POST | ✅ ADMIN or CUSTOMER | Create new order |
| `/orders/customer/{username}` | GET | ✅ ADMIN or CUSTOMER | Get orders by customer |

---

### 🔵 CUSTOMER Role Endpoints (CUSTOMER Token Required)

#### Car Service
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/cars` | POST | ✅ CUSTOMER or ADMIN | Register new car |

#### Order Service
| Endpoint | Method | Token Required | Description |
|----------|--------|----------------|-------------|
| `/orders` | POST | ✅ CUSTOMER or ADMIN | Create new order |
| `/orders/customer/{username}` | GET | ✅ CUSTOMER or ADMIN | Get own orders (customers can only view their own) |

---

### 🟡 WASHER Role Endpoints (WASHER Token Required)

Currently, no endpoints explicitly require WASHER token in the code. Washers can:
- View their assigned orders (no token required)
- Update order status (no token required)

---

## Detailed Endpoint Analysis

### Auth Service (Port 8081)

#### 1. Register Customer/Washer
- **Endpoint**: `POST /api/auth/register/{role}`
- **Token Required**: ❌ No (but optional Authorization header accepted)
- **Roles**: CUSTOMER, WASHER
- **Description**: Public registration for customers and washers

#### 2. Admin Register User
- **Endpoint**: `POST /api/auth/admin/register/{role}`
- **Token Required**: ✅ ADMIN
- **Description**: Admin can register users of any role
- **Header**: `Authorization: Bearer <admin_token>`

#### 3. Login
- **Endpoint**: `POST /api/auth/login/{role}`
- **Token Required**: ❌ No
- **Roles**: CUSTOMER, WASHER, ADMIN
- **Description**: Login returns JWT token for authenticated requests

#### 4. Delete User
- **Endpoint**: `DELETE /api/auth/delete/{role}`
- **Token Required**: ❌ No (requires credentials in body)
- **Description**: Delete user account with username/password

#### 5. Validate Token
- **Endpoint**: `GET /api/auth/validate?token={token}`
- **Token Required**: ❌ No
- **Description**: Validate if JWT token is valid

---

### Car Service (Port 8083)

#### 1. Register Car
- **Endpoint**: `POST /cars`
- **Token Required**: ✅ CUSTOMER or ADMIN
- **Code Check**:
```java
String role = jwtUtil.extractRole(jwtToken);
if (!\"CUSTOMER\".equals(role) && !\"ADMIN\".equals(role)) {
    return ResponseEntity.status(403).body(\"Only CUSTOMER and ADMIN can register cars\");
}
```
- **Header**: `Authorization: Bearer <customer_token>` or `Bearer <admin_token>`

#### 2. Get Cars by Owner
- **Endpoint**: `GET /cars/owner/{username}`
- **Token Required**: ❌ No
- **Description**: Retrieve all cars owned by a specific customer

#### 3. Get Car by License Plate
- **Endpoint**: `GET /cars/{licensePlate}`
- **Token Required**: ❌ No
- **Description**: Get specific car details

#### 4. Get All Cars
- **Endpoint**: `GET /cars`
- **Token Required**: ❌ No
- **Description**: Admin function to get all cars (no enforcement in code)

#### 5. Update Car
- **Endpoint**: `PUT /cars/{licensePlate}`
- **Token Required**: ❌ No
- **Description**: Update car information

---

### Order Service (Port 8084)

#### 1. Create Order
- **Endpoint**: `POST /orders`
- **Token Required**: ✅ CUSTOMER or ADMIN
- **Code Check**:
```java
String role = jwtUtil.extractRole(jwtToken);
if (!\"CUSTOMER\".equals(role) && !\"ADMIN\".equals(role)) {
    return ResponseEntity.status(403).body(\"Only CUSTOMER and ADMIN can create orders\");
}
```
- **Header**: `Authorization: Bearer <customer_token>` or `Bearer <admin_token>`

#### 2. Get Orders by Customer
- **Endpoint**: `GET /orders/customer/{username}`
- **Token Required**: ✅ CUSTOMER or ADMIN
- **Code Check**:
```java
String role = jwtUtil.extractRole(jwtToken);
if (!\"CUSTOMER\".equals(role) && !\"ADMIN\".equals(role)) {
    return ResponseEntity.status(403);
}
// Customers can only view their own orders
if (\"CUSTOMER\".equals(role) && !tokenUsername.equals(username)) {
    return ResponseEntity.status(403).body(\"Customers can only view their own orders\");
}
```
- **Header**: `Authorization: Bearer <customer_token>` or `Bearer <admin_token>`
- **Note**: Customers can only view their own orders; admins can view any customer's orders

#### 3. Get Orders by Washer
- **Endpoint**: `GET /orders/washer/{username}`
- **Token Required**: ❌ No
- **Description**: Get all orders assigned to a washer

#### 4. Get Order by ID
- **Endpoint**: `GET /orders/{id}`
- **Token Required**: ❌ No
- **Description**: Get specific order details

#### 5. Update Order Status
- **Endpoint**: `PUT /orders/{id}/status?status={status}`
- **Token Required**: ❌ No
- **Description**: Update order status (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED)

#### 6. Assign Washer
- **Endpoint**: `PUT /orders/{id}/assign?washerUsername={username}`
- **Token Required**: ❌ No
- **Description**: Assign washer to order

#### 7. Get All Orders
- **Endpoint**: `GET /orders`
- **Token Required**: ❌ No
- **Description**: Admin function to get all orders (no enforcement in code)

---

### Payment Service (Port 8085)

All payment endpoints currently have **NO TOKEN REQUIREMENT** in the code.

#### 1. Create Checkout Session
- **Endpoint**: `POST /payments/create-checkout-session`
- **Token Required**: ❌ No
- **Description**: Create Stripe checkout session

#### 2. Payment Success/Cancel/Failed Pages
- **Endpoints**: 
  - `GET /payments/payment-success?session_id={id}`
  - `GET /payments/payment-cancel`
  - `GET /payments/payment-failed?reason={reason}`
- **Token Required**: ❌ No
- **Description**: Stripe redirect pages

#### 3. Webhook
- **Endpoint**: `POST /payments/webhook`
- **Token Required**: ❌ No (uses Stripe-Signature header)
- **Description**: Stripe webhook for payment events

#### 4. Process Payment
- **Endpoint**: `POST /payments/process`
- **Token Required**: ❌ No
- **Description**: Process payment directly

#### 5. Get Payment by Order ID
- **Endpoint**: `GET /payments/order/{orderId}`
- **Token Required**: ❌ No
- **Description**: Retrieve payment for specific order

#### 6. Get Payments by Customer
- **Endpoint**: `GET /payments/customer/{username}`
- **Token Required**: ❌ No
- **Description**: Get all payments for a customer

#### 7. Create Payment Intent
- **Endpoint**: `GET /payments/client-secret?amount={amount}`
- **Token Required**: ❌ No
- **Description**: Create Stripe payment intent

#### 8. Refund Payment
- **Endpoint**: `POST /payments/{paymentId}/refund`
- **Token Required**: ❌ No
- **Description**: Refund a payment

#### 9. Download Receipt
- **Endpoint**: `GET /payments/{paymentId}/receipt`
- **Token Required**: ❌ No
- **Description**: Download PDF receipt

---

## How to Use Tokens in Postman

### Step 1: Login and Get Token
1. Use login endpoint: `POST /api/auth/login/{role}`
2. Copy the `token` from response
3. Store in Postman variable:
   - `{{admin_token}}` for ADMIN
   - `{{customer_token}}` for CUSTOMER
   - `{{washer_token}}` for WASHER

### Step 2: Add Token to Request
For endpoints requiring token, add header:
```
Authorization: Bearer {{customer_token}}
```

### Example Login Requests

#### Customer Login
```json
POST http://localhost:8080/api/auth/login/CUSTOMER
{
  "username": "customer1",
  "password": "password123"
}
```

#### Admin Login
```json
POST http://localhost:8080/api/auth/login/ADMIN
{
  "username": "admin",
  "password": "admin123"
}
```

#### Washer Login
```json
POST http://localhost:8080/api/auth/login/WASHER
{
  "username": "washer1",
  "password": "password123"
}
```

---

## Security Notes

1. **Gateway Security**: API Gateway (port 8080) currently permits all exchanges - no JWT validation at gateway level
2. **Service-Level Security**: Token validation happens at individual service level
3. **Limited Enforcement**: Many endpoints don't require tokens even though they should (security improvement needed)
4. **Customer Isolation**: Customers can only view their own orders when using GET `/orders/customer/{username}`
5. **Default Admin**: System creates default admin account on startup (check DefaultAdminConfig.java)

---

## Recommendations for Production

1. **Add Token Validation**: Implement JWT validation at API Gateway level
2. **Secure Payment Endpoints**: Add authentication to payment endpoints
3. **Role-Based Access Control**: Implement proper RBAC for all endpoints
4. **Washer Endpoints**: Add token requirements for washer-specific operations
5. **Admin-Only Endpoints**: Secure admin functions (get all cars, get all orders, refunds)
