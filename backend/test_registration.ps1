# Test Admin Registration Endpoint
Write-Host "🧪 Testing Admin Registration Endpoint" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test 1: Valid Registration
Write-Host "`n1️⃣ Testing Valid Registration..." -ForegroundColor Yellow
$validData = @{
    username = "testadmin"
    password = "securepass123"
    confirmPassword = "securepass123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $validData -ContentType "application/json"
    Write-Host "✅ Valid Registration - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Valid Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Password Mismatch
Write-Host "`n2️⃣ Testing Password Mismatch..." -ForegroundColor Yellow
$invalidData = @{
    username = "testadmin2"
    password = "securepass123"
    confirmPassword = "differentpass"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $invalidData -ContentType "application/json"
    Write-Host "❌ Password Mismatch - Expected 400 but got: $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Password Mismatch - Correctly rejected with 400" -ForegroundColor Green
    } else {
        Write-Host "❌ Password Mismatch - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Duplicate Username
Write-Host "`n3️⃣ Testing Duplicate Username..." -ForegroundColor Yellow
$duplicateData = @{
    username = "testadmin"
    password = "anotherpass123"
    confirmPassword = "anotherpass123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $duplicateData -ContentType "application/json"
    Write-Host "❌ Duplicate Username - Expected 409 but got: $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "✅ Duplicate Username - Correctly rejected with 409" -ForegroundColor Green
    } else {
        Write-Host "❌ Duplicate Username - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Invalid Username Format
Write-Host "`n4️⃣ Testing Invalid Username Format..." -ForegroundColor Yellow
$invalidUsernameData = @{
    username = "test-admin"
    password = "securepass123"
    confirmPassword = "securepass123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $invalidUsernameData -ContentType "application/json"
    Write-Host "❌ Invalid Username - Expected 400 but got: $($response.StatusCode)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Invalid Username - Correctly rejected with 400" -ForegroundColor Green
    } else {
        Write-Host "❌ Invalid Username - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Registration Testing Complete!" -ForegroundColor Green
Write-Host "Now you can test the login endpoint with your new admin account!" -ForegroundColor Cyan
