#!/bin/bash

echo "Starting NitroNews Development Environment..."
echo

echo "Starting Laravel Backend Server..."
cd backend && php artisan serve &
BACKEND_PID=$!

echo "Starting React Frontend Server..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
