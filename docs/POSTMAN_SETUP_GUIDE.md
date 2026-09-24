# Car Wash Management - Postman Setup Guide

## 📋 Overview
This guide provides comprehensive Postman setup for testing the Car Wash Management microservices system.

## 🚀 Quick Start

### 1. Import Files
1. **Import Environment**: `CarWash-Postman-Environment.json`
2. **Import Collection**: `CarWash-Enhanced-Postman-Collection.json`
3. **Select Environment**: Choose "Car Wash Management - Environment"

### 2. Start Services
Ensure all services are running:
```bash
# Start in this order:
1. Eureka Registry (port 8761)
2. Auth Service (port 8081)
3. Car Service
4. Order Service  
5. Payment Service
6. API Gateway (port 8080)
```

### 3. Initial Setup
Run the "🚀 Setup - Login All Roles" folder to:
- Login as admin and get token
- Register test customer and washer
- Get tokens for all roles

## 📁 Collection Structure

### 🚀 Setup - Login All Roles
**Purpose**: Initial authentication setup
- Login admin (default: admin/admin123)
- Register and login test customer
- Register and login test washer
- Automatically saves JWT tokens to environment

### 🔧 System Health Checks
**Purpose**: Verify all services are running
- Check Eureka Registry
- Check API Gateway
- Validate JWT tokens

### 👤 Customer Workflow
**Purpose**: Complete customer journey
1. Register car
2. Create wash order
3. Create payment session
4. View orders and cars

### 🧽 Washer Workflow
**Purpose**: Washer operations
1. View assigned orders
2. Update order status (IN_PROGRESS)
3. Complete orders

### 👨💼 Admin Operations
**Purpose**: Administrative functions
- User management
- System overview
- Order assignment

### 💳 Payment Operations
**Purpose**: Payment processing
- Get payments by order
- Download receipt PDFs
- Create payment intents

## 🔑 Environment Variables

### Base URLs
- `base_url`: http://localhost:8080 (API Gateway)
- `auth_service_url`: http://localhost:8081 (Direct auth access)
- `eureka_url`: http://localhost:8761 (Service registry)

### Authentication Tokens
- `admin_token`: JWT token for admin role
- `customer_token`: JWT token for customer role  
- `washer_token`: JWT token for washer role

### Test Data
- `admin_username`: admin
- `admin_password`: admin123
- `test_customer_username`: customer1
- `test_customer_password`: password123
- `test_washer_username`: washer1
- `test_washer_password`: password123

## 🔄 Automated Features

### Token Management
- Automatic JWT token extraction from login responses
- Tokens saved to environment variables
- Pre-request scripts for authentication

### Test Scripts
- Response validation
- Status code checks
- Data extraction for chaining requests

### Variable Updates
- Dynamic test data updates
- Order IDs and payment IDs automatically captured

## 🧪 Testing Workflows

### Complete Customer Journey
1. Run "Setup - Login All Roles"
2. Execute "Customer Workflow" folder
3. Verify order creation and payment

### Washer Operations
1. Ensure orders exist (run customer workflow first)
2. Execute "Washer Workflow" folder
3. Verify order status updates

### Admin Management
1. Run "Admin Operations" folder
2. Test user management
3. Verify system overview functions

## 🛠️ Troubleshooting

### Common Issues

**Services Not Running**
- Check if all microservices are started
- Verify Eureka registry shows all services
- Use "System Health Checks" folder

**Authentication Failures**
- Re-run "Setup - Login All Roles"
- Check if tokens are saved in environment
- Verify JWT secret matches across services

**Database Connection Issues**
- Ensure MySQL is running
- Check database credentials in application.properties
- Verify database `carwash_auth` exists

**Port Conflicts**
- Default ports: Gateway(8080), Auth(8081), Eureka(8761)
- Update environment variables if using different ports

### Service Endpoints

| Service | Port | Health Check |
|---------|------|--------------|
| Eureka Registry | 8761 | http://localhost:8761/ |
| API Gateway | 8080 | http://localhost:8080/ |
| Auth Service | 8081 | Direct service access |
| Car Service | Dynamic | Via Eureka |
| Order Service | Dynamic | Via Eureka |
| Payment Service | Dynamic | Via Eureka |

## 📊 Test Data Examples

### Car Registration
```json
{
  "licensePlate": "ABC123",
  "make": "Honda",
  "model": "Civic", 
  "year": 2021,
  "color": "Blue",
  "type": "SEDAN"
}
```

### Order Creation
```json
{
  "licensePlate": "ABC123",
  "serviceType": "FULL_WASH",
  "totalAmount": 75.00,
  "scheduledTime": "2024-12-26T14:00:00",
  "location": "123 Main Street"
}
```

### Payment Session
```json
{
  "orderId": 1,
  "amount": 75.00
}
```

## 🔐 Security Notes

- JWT tokens expire after 24 hours
- Tokens are stored as secret variables
- Admin credentials should be changed in production
- Use HTTPS in production environments

## 📈 Performance Testing

### Load Testing Recommendations
1. Use Postman Runner for multiple iterations
2. Test concurrent user scenarios
3. Monitor service response times
4. Verify database performance under load

### Monitoring
- Check Eureka dashboard for service health
- Monitor API Gateway logs
- Track JWT token validation performance

## 🎯 Best Practices

1. **Always run setup first**: Execute "Setup - Login All Roles" before testing
2. **Use workflows**: Follow the predefined workflow folders
3. **Check health**: Run health checks if requests fail
4. **Environment management**: Keep environment variables updated
5. **Token refresh**: Re-login if tokens expire

## 📞 Support

For issues with the Postman collection:
1. Check service logs
2. Verify environment variables
3. Ensure all services are registered in Eureka
4. Test individual endpoints before workflows