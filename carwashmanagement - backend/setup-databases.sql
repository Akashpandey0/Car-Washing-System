-- Create all required databases for Car Wash Management System

CREATE DATABASE IF NOT EXISTS carwash_auth;
CREATE DATABASE IF NOT EXISTS carwash_car;
CREATE DATABASE IF NOT EXISTS carwash_order;
CREATE DATABASE IF NOT EXISTS carwash_payment;

-- Show all databases
SHOW DATABASES;

-- Grant privileges (if needed)
GRANT ALL PRIVILEGES ON carwash_auth.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON carwash_car.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON carwash_order.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON carwash_payment.* TO 'root'@'localhost';

FLUSH PRIVILEGES;

SELECT 'All databases created successfully!' AS Status;
