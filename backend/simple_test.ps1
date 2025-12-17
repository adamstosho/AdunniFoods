# Simple API Endpoint Testing Script
$baseUrl = "http://localhost:5000/api"

Write-Host "Testing Adunni Foods API Endpoints..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Check (GET /)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method GET
    Write-Host "PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Products List
Write-Host "`n2. Testing Products List (GET /products)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method GET
    Write-Host "PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Admin Login (Invalid)
Write-Host "`n3. Testing Admin Login - Invalid Credentials" -ForegroundColor Yellow
try {
    $body = '{"username":"invalid","password":"wrong"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "PASSED - Correctly rejected with 401" -ForegroundColor Green
    } else {
        Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Create Order
Write-Host "`n4. Testing Create Order (POST /orders)" -ForegroundColor Yellow
try {
    $orderBody = '{"customerName":"Test Customer","customerPhone":"2348144665646","address":"123 Test Street","items":[{"product":"507f1f77bcf86cd799439011","name":"Test Product","qty":1,"price":15.99}],"totalAmount":15.99,"paymentMethod":"cash_on_delivery"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method POST -ContentType "application/json" -Body $orderBody
    Write-Host "PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Protected Endpoints (Should return 401)
Write-Host "`n5. Testing Protected Endpoints (Should require auth)" -ForegroundColor Yellow

# Products Create
try {
    $productBody = '{"name":"Test Product","slug":"test-product","price":19.99}'
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method POST -ContentType "application/json" -Body $productBody
    Write-Host "FAILED - Products Create should require auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "PASSED - Products Create correctly requires auth" -ForegroundColor Green
    } else {
        Write-Host "FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Orders List
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method GET
    Write-Host "FAILED - Orders List should require auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "PASSED - Orders List correctly requires auth" -ForegroundColor Green
    } else {
        Write-Host "FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# File Upload
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/upload" -Method POST
    Write-Host "FAILED - File Upload should require auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "PASSED - File Upload correctly requires auth" -ForegroundColor Green
    } else {
        Write-Host "FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# CSV Export
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders/export/csv" -Method GET
    Write-Host "FAILED - CSV Export should require auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "PASSED - CSV Export correctly requires auth" -ForegroundColor Green
    } else {
        Write-Host "FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Invalid Endpoint
Write-Host "`n6. Testing Invalid Endpoint (GET /invalid)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/invalid" -Method GET
    Write-Host "FAILED - Should return 404" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "PASSED - Correctly returns 404" -ForegroundColor Green
    } else {
        Write-Host "FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=====================================" -ForegroundColor Green
Write-Host "Testing completed!" -ForegroundColor Green
