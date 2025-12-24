# PowerShell script to set up environment variables for MongoDB connection
Write-Host "Setting up environment variables for MongoDB connection..." -ForegroundColor Green

# Set environment variables
$env:MONGODB_URI = "mongodb+srv://guptayush689:sh81Ega1QUQ3Y52E@ayush.cddfsfv.mongodb.net/?retryWrites=true&w=majority&appName=Ayush"
$env:JWT_SECRET = "767542f2102ea8624aed85dc3c9b97685d059982c09811dd8bb9467122f9d7427d47113420687885feff2abfbc848380701880907505c7664e94e07365d8ec02"
$env:PORT = "8000"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "MONGODB_URI: $env:MONGODB_URI" -ForegroundColor Yellow
Write-Host "JWT_SECRET: $env:JWT_SECRET" -ForegroundColor Yellow
Write-Host "PORT: $env:PORT" -ForegroundColor Yellow

Write-Host "`nNow you can run: node test-connection.js" -ForegroundColor Cyan
