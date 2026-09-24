# 🚗 Car Wash Management System

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-brightgreen?style=for-the-badge&logo=springboot)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2024.0.1-blue?style=for-the-badge&logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)

A full-stack microservices-based car wash management platform with role-based access, JWT authentication, Stripe payments, and a React frontend.

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Microservices](#-microservices)
- [Getting Started](#-getting-started)
- [Default Credentials](#-default-credentials)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Data Models](#-data-models)
- [Frontend](#-frontend)
- [Project Structure](#-project-structure)

---

## 🌟 Overview

The Car Wash Management System is a microservices application that allows:

- 👤 **Customers** to register cars, place wash orders, and pay via Stripe
- 🧽 **Washers** to view and update their assigned orders
- 👨‍💼 **Admins** to manage users, cars, orders, and payments
- 💳 **Stripe integration** for real payment processing with PDF receipts

---

## 🏗 Architecture

```
                        ┌─────────────────┐
                        │   React Frontend │
                        │  localhost:3000  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   API Gateway   │
                        │  localhost:8080  │
                        └────────┬────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                       │
 ┌────────▼───────┐   ┌──────────▼──────┐   ┌──────────▼──────┐
 │  Auth Service  │   │   Car Service   │   │  Order Service  │
 │  port: 8081    │   │  Eureka-routed  │   │  Eureka-routed  │
 └────────────────┘   └─────────────────┘   └─────────────────┘
                                                      │
                                           ┌──────────▼──────┐
                                           │ Payment Service │
                                           │  Eureka-routed  │
                                           └─────────────────┘
                                                      │
                                           ┌──────────▼──────┐
                                           │  Eureka Registry│
                                           │  port: 8761     │
                                           └─────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.4.4 |
| Microservices | Spring Cloud 2024.0.1, Eureka, API Gateway |
| Security | Spring Security, JWT |
| Database | MySQL 8 |
| Payments | Stripe API |
| PDF | iText / PDF generation |
| Frontend | React 19, Axios, React Router v7 |
| Build | Maven |

---

## 🔧 Microservices

| Service | Port | Description |
|---------|------|-------------|
| `service-registry` | 8761 | Eureka service discovery |
| `api-gateway` | 8080 | Single entry point, JWT filter, routing |
| `auth-service` | 8081 | Register, login, user management |
| `car-service` | dynamic | Car CRUD operations |
| `order-service` | dynamic | Order lifecycle management |
| `payment-service` | dynamic | Stripe payments, receipts, refunds |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+
- Stripe account (for payments)

### 1. Database Setup

```sql
CREATE DATABASE carwash_auth;
CREATE DATABASE carwash_cars;
CREATE DATABASE carwash_orders;
CREATE DATABASE carwash_payments;
```

### 2. Start Backend Services (in order)

```bash
# 1. Service Registry
cd carwashmanagement\ -\ backend/service-registry
mvn spring-boot:run

# 2. Auth Service
cd ../auth-service
mvn spring-boot:run

# 3. Car Service
cd ../car-service
mvn spring-boot:run

# 4. Order Service
cd ../order-service
mvn spring-boot:run

# 5. Payment Service
cd ../payment-service
mvn spring-boot:run

# 6. API Gateway (last)
cd ../api-gateway
mvn spring-boot:run
```

### 3. Start Frontend

```bash
cd carwashmanagement-frontend
npm install
npm start
```

Frontend runs at → `http://localhost:3000`

---

## 🔑 Default Credentials

> ⚠️ Change these in production!

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin_user` | `admin@123` |

The default admin is auto-created on first startup via `DefaultAdminConfig.java`.

---

## 📡 API Reference

All requests go through the API Gateway at `http://localhost:8080`.

<details>
<summary><b>🔓 Auth Service — /api/auth</b></summary>

### Public Endpoints (No token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/{role}` | Register as CUSTOMER or WASHER |
| POST | `/api/auth/login/{role}` | Login — returns JWT token |
| GET | `/api/auth/validate?token=` | Validate a JWT token |

**Register Body:**
```json
{
  "username": "john",
  "password": "pass123",
  "email": "john@example.com"
}
```

**Login Body:**
```json
{
  "username": "john",
  "password": "pass123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john",
  "role": "CUSTOMER"
}
```

### Admin Endpoints (Admin token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/admin/register/{role}` | Register any user as any role |
| DELETE | `/api/auth/delete` | Delete a user (body: plain text username) |
| GET | `/api/auth/users` | Get all users |

</details>

<details>
<summary><b>🚗 Car Service — /cars</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/cars` | CUSTOMER / ADMIN | Register a car |
| GET | `/cars` | None | Get all cars |
| GET | `/cars/{licensePlate}` | None | Get car by license plate |
| GET | `/cars/owner/{username}` | None | Get cars by owner |
| PUT | `/cars/{licensePlate}` | None | Update car details |

**Register Car Body:**
```json
{
  "licensePlate": "MH12AB1234",
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "color": "Blue",
  "type": "SEDAN"
}
```

**Car Types:** `SEDAN`, `SUV`, `HATCHBACK`, `COUPE`, `CONVERTIBLE`, `TRUCK`, `VAN`

</details>

<details>
<summary><b>📋 Order Service — /orders</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | CUSTOMER / ADMIN | Create an order |
| GET | `/orders` | None | Get all orders |
| GET | `/orders/{id}` | None | Get order by ID |
| GET | `/orders/customer` | CUSTOMER / ADMIN | Get my orders (from token) |
| GET | `/orders/washer` | WASHER / ADMIN | Get assigned orders (from token) |
| PUT | `/orders/{id}/status?status=` | None | Update order status |
| PUT | `/orders/{id}/assign?washerUsername=` | None | Assign washer to order |

**Create Order Body:**
```json
{
  "licensePlate": "MH12AB1234",
  "serviceType": "FULL_WASH",
  "totalAmount": 100.00,
  "scheduledTime": "2025-12-25T10:00:00",
  "location": "123 Main Street"
}
```

**Order Statuses:** `PENDING` → `ASSIGNED` → `IN_PROGRESS` → `COMPLETED` → `PAID` / `CANCELLED`

</details>

<details>
<summary><b>💳 Payment Service — /payments</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/create-checkout-session` | CUSTOMER | Create Stripe checkout session |
| GET | `/payments/verify?session_id=` | None | Verify & complete payment |
| GET | `/payments/customer` | CUSTOMER / ADMIN | Get my payments |
| GET | `/payments/order/{orderId}` | None | Get payment by order ID |
| GET | `/payments/client-secret?amount=` | None | Create payment intent |
| POST | `/payments/{paymentId}/refund` | None | Refund by payment ID |
| POST | `/payments/refund/order/{orderId}` | None | Refund by order ID |
| GET | `/payments/{paymentId}/receipt` | None | Download PDF receipt |

**Create Checkout Body:**
```json
{
  "orderId": 1,
  "amount": 100.00
}
```

**Payment Statuses:** `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`

</details>

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **ADMIN** | Register/delete any user, manage all cars/orders/payments, view all data |
| **CUSTOMER** | Register cars, create orders, make payments, view own data, delete own account |
| **WASHER** | View assigned orders, update order status to IN_PROGRESS / COMPLETED |

> JWT tokens expire after **24 hours** (`jwt.expiration=86400000` ms).

---

## 🗃 Data Models

<details>
<summary><b>User</b></summary>

| Field | Type | Notes |
|-------|------|-------|
| id | Long | Auto-generated |
| username | String | Unique |
| password | String | BCrypt encoded |
| email | String | Unique |
| role | Enum | CUSTOMER, WASHER, ADMIN |
| active | boolean | Default: true |

</details>

<details>
<summary><b>Car</b></summary>

| Field | Type | Notes |
|-------|------|-------|
| id | Long | Auto-generated |
| ownerUsername | String | Extracted from JWT |
| licensePlate | String | Unique |
| make | String | e.g. Toyota |
| model | String | e.g. Camry |
| year | Integer | |
| color | String | |
| type | Enum | SEDAN, SUV, HATCHBACK, etc. |
| active | boolean | Default: true |

</details>

<details>
<summary><b>Order</b></summary>

| Field | Type | Notes |
|-------|------|-------|
| id | Long | Auto-generated |
| customerUsername | String | Extracted from JWT |
| carLicensePlate | String | |
| serviceType | String | e.g. FULL_WASH, BASIC_WASH |
| totalAmount | BigDecimal | |
| status | Enum | PENDING → COMPLETED |
| washerUsername | String | Assigned by admin |
| scheduledDateTime | LocalDateTime | |
| customerAddress | String | Optional |
| specialInstructions | String | Optional |

</details>

<details>
<summary><b>Payment</b></summary>

| Field | Type | Notes |
|-------|------|-------|
| id | Long | Auto-generated |
| orderId | Long | |
| customerUsername | String | |
| amount | BigDecimal | |
| status | Enum | PENDING, COMPLETED, FAILED, REFUNDED |
| transactionId | String | Stripe session/transaction ID |
| paymentMethod | String | e.g. Stripe |
| taxAmount | BigDecimal | |
| refundAmount | BigDecimal | |

</details>

---

## 🖥 Frontend

Built with React 19 and React Router v7, running on port `3000`.

### Pages by Role

| Page | Role | Path |
|------|------|------|
| Landing | Public | `/` |
| Login | Public | `/login` |
| Register | Public | `/register` |
| Customer Home | CUSTOMER | `/customer` |
| My Cars | CUSTOMER | `/my-cars` |
| My Orders | CUSTOMER | `/my-orders` |
| My Payments | CUSTOMER | `/my-payments` |
| Admin Home | ADMIN | `/admin` |
| Admin Users | ADMIN | `/admin/users` |
| Admin Cars | ADMIN | `/admin/cars` |
| Admin Orders | ADMIN | `/admin/orders` |
| Washer Home | WASHER | `/washer` |
| Washer Orders | WASHER | `/washer/orders` |

### Frontend Environment

The frontend uses Axios with a base URL of `http://localhost:8080` (API Gateway). JWT token is stored in context and sent as `Authorization: Bearer <token>` on every protected request.

---

## 📁 Project Structure

```
CarWashProject/
├── carwashmanagement - backend/
│   ├── service-registry/       # Eureka Server (port 8761)
│   ├── api-gateway/            # Spring Cloud Gateway (port 8080)
│   ├── auth-service/           # JWT Auth (port 8081)
│   ├── car-service/            # Car management
│   ├── order-service/          # Order management
│   ├── payment-service/        # Stripe payments + PDF
│   └── pom.xml                 # Parent POM
├── carwashmanagement-frontend/
│   ├── src/
│   │   ├── api/                # Axios API calls
│   │   ├── components/         # Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT state)
│   │   └── pages/              # All role-based pages
│   └── package.json
└── docs/
    ├── CarWash-Postman-Collection-By-Roles.json
    ├── POSTMAN_SETUP_GUIDE.md
    └── uml-diagrams/
```

---

## 🔐 Security Notes

- All passwords are **BCrypt** encoded
- JWT secret is shared across all services via `application.properties`
- API Gateway has CORS configured for `http://localhost:*`
- In production: use environment variables for secrets, enable HTTPS, rotate JWT secret

---

<div align="center">
Made with ❤️ | Car Wash Management System
</div>
