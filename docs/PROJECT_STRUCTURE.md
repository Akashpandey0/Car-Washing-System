# Project Structure

```
carwashmanagement/
│
├── service-registry/          # Eureka Server (8761)
│   ├── src/main/
│   └── pom.xml
│
├── api-gateway/               # API Gateway (8080)
│   ├── src/main/
│   └── pom.xml
│
├── auth-service/              # Authentication (8081)
│   ├── src/main/
│   ├── AUTH_API_DOCUMENTATION.md
│   └── pom.xml
│
├── car-service/               # Car Management (8083)
│   ├── src/main/
│   └── pom.xml
│
├── order-service/             # Order Management (8084)
│   ├── src/main/
│   └── pom.xml
│
├── payment-service/           # Payment Processing (8085)
│   ├── src/main/
│   └── pom.xml
│
├── scripts/
│   ├── database-setup.sql     # Database creation
│   └── start-all-services.bat # Auto-start script
│
├── README.md                  # Main documentation
├── FINAL_ARCHITECTURE.md      # Architecture details
└── POSTMAN_COLLECTION.md      # API testing guide
```

## Clean Structure

✅ Only 6 services
✅ Only 3 documentation files
✅ No redundant code
✅ No unused services
