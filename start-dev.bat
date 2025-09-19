@echo off
echo Starting NitroNews Development Environment...
echo.

echo Starting Laravel Backend Server...
start "Laravel Backend" cmd /k "cd backend && php artisan serve"

echo Starting React Frontend Server...
start "React Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
