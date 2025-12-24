# Student Feedback System - Fix Common Issues
Write-Host "Fixing common issues in Student Feedback System..." -ForegroundColor Green

# 1. Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
pip install -r requirements.txt
python -m pip install --upgrade pip

# 2. Run Django migrations
Write-Host "Running Django migrations..." -ForegroundColor Yellow
python manage.py makemigrations
python manage.py migrate

# 3. Create superuser if it doesn't exist
Write-Host "Checking for superuser..." -ForegroundColor Yellow
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(is_superuser=True).exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123')"

# 4. Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install

# 5. Install Node.js gateway dependencies
Write-Host "Installing Node.js gateway dependencies..." -ForegroundColor Yellow
Set-Location ..
npm install

Write-Host "All fixes applied successfully!" -ForegroundColor Green
Write-Host "You can now run: .\start_servers.ps1" -ForegroundColor Cyan
