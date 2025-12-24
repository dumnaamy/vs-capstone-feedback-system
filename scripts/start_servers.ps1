# Student Feedback System Startup Script
Write-Host "Starting Student Feedback System..." -ForegroundColor Green

# Start Django backend in background
Write-Host "Starting Django backend on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd backend; python manage.py runserver 8000" -WindowStyle Normal

# Wait a moment for Django to start
Start-Sleep -Seconds 3

# Start Node.js gateway
Write-Host "Starting Node.js API Gateway on port 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd api-gateway; npm start" -WindowStyle Normal

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Django Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Node.js Gateway: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
