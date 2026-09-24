@echo off
echo Checking Car Wash Services Status...
echo.

echo [1] Checking Service Registry (8761)...
curl -s http://localhost:8761 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Service Registry is running
) else (
    echo [FAILED] Service Registry is NOT running - START THIS FIRST!
)

echo.
echo [2] Checking API Gateway (8080)...
curl -s http://localhost:8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] API Gateway is running
) else (
    echo [FAILED] API Gateway is NOT running
)

echo.
echo [3] Checking Auth Service (8081)...
curl -s http://localhost:8081 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Auth Service is running
) else (
    echo [FAILED] Auth Service is NOT running
)

echo.
echo [4] Checking Car Service (8083)...
curl -s http://localhost:8083 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Car Service is running
) else (
    echo [FAILED] Car Service is NOT running - THIS IS NEEDED FOR ADDING CARS!
)

echo.
echo [5] Checking Order Service (8084)...
curl -s http://localhost:8084 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Order Service is running
) else (
    echo [FAILED] Order Service is NOT running
)

echo.
echo [6] Checking Payment Service (8085)...
curl -s http://localhost:8085 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Payment Service is running
) else (
    echo [FAILED] Payment Service is NOT running
)

echo.
echo ========================================
echo Open Eureka Dashboard: http://localhost:8761
echo ========================================
pause
