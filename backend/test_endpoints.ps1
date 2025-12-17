# Adunni Foods API Endpoint Testing Script
# This script tests all endpoints to ensure they're working correctly

Write-Host "🚀 Starting Adunni Foods API Endpoint Tests..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"
$testResults = @()

# Test 1: Health Check
Write-Host "`n1. Testing Health Check (GET /)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health Check: PASSED" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $testResults += @{Test="Health Check"; Status="PASSED"; Details="Status 200"}
    } else {
        Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
        $testResults += @{Test="Health Check"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Health Check"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 2: Products List (Public)
Write-Host "`n2. Testing Products List (GET /products)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Products List: PASSED" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $testResults += @{Test="Products List"; Status="PASSED"; Details="Status 200"}
    } else {
        Write-Host "❌ Products List: FAILED" -ForegroundColor Red
        $testResults += @{Test="Products List"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ Products List: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Products List"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 3: Admin Login (Invalid Credentials)
Write-Host "`n3. Testing Admin Login - Invalid Credentials (POST /auth/login)" -ForegroundColor Yellow
try {
    $body = '{"username":"invalid","password":"wrong"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    if ($response.StatusCode -eq 401) {
        Write-Host "✅ Admin Login (Invalid): PASSED" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $testResults += @{Test="Admin Login (Invalid)"; Status="PASSED"; Details="Status 401 - Correctly rejected"}
    } else {
        Write-Host "❌ Admin Login (Invalid): FAILED" -ForegroundColor Red
        $testResults += @{Test="Admin Login (Invalid)"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ Admin Login (Invalid): FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Admin Login (Invalid)"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 4: Create Order (Public)
Write-Host "`n4. Testing Create Order (POST /orders)" -ForegroundColor Yellow
try {
    $orderBody = '{
        "customerName": "Test Customer",
        "customerPhone": "2348144665646",
        "address": "123 Test Street, Lagos",
        "items": [
            {
                "product": "507f1f77bcf86cd799439011",
                "name": "Test Plantain Chips",
                "qty": 2,
                "price": 15.99
            }
        ],
        "totalAmount": 31.98,
        "paymentMethod": "cash_on_delivery"
    }'
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method POST -ContentType "application/json" -Body $orderBody
    if ($response.StatusCode -eq 201) {
        Write-Host "✅ Create Order: PASSED" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $testResults += @{Test="Create Order"; Status="PASSED"; Details="Status 201"}
    } else {
        Write-Host "❌ Create Order: FAILED" -ForegroundColor Red
        Write-Host "   Response: $($response.Content)" -ForegroundColor Red
        $testResults += @{Test="Create Order"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ Create Order: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{Test="Create Order"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 5: Protected Endpoints (Without Auth)
Write-Host "`n5. Testing Protected Endpoints (Without Authentication)" -ForegroundColor Yellow

# Test Products Create (Protected)
try {
    $productBody = '{"name":"Test Product","slug":"test-product","price":19.99}'
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method POST -ContentType "application/json" -Body $productBody
    Write-Host "❌ Products Create (No Auth): FAILED - Should require authentication" -ForegroundColor Red
    $testResults += @{Test="Products Create (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Products Create (No Auth): PASSED - Correctly requires authentication" -ForegroundColor Green
        $testResults += @{Test="Products Create (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ Products Create (No Auth): FAILED" -ForegroundColor Red
        $testResults += @{Test="Products Create (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Test Orders List (Protected)
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method GET
    Write-Host "❌ Orders List (No Auth): FAILED - Should require authentication" -ForegroundColor Red
    $testResults += @{Test="Orders List (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Orders List (No Auth): PASSED - Correctly requires authentication" -ForegroundColor Green
        $testResults += @{Test="Orders List (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ Orders List (No Auth): FAILED" -ForegroundColor Red
        $testResults += @{Test="Orders List (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Test 6: File Upload Endpoint (Protected)
Write-Host "`n6. Testing File Upload Endpoint (POST /upload)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/upload" -Method POST
    Write-Host "❌ File Upload (No Auth): FAILED - Should require authentication" -ForegroundColor Red
    $testResults += @{Test="File Upload (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ File Upload (No Auth): PASSED - Correctly requires authentication" -ForegroundColor Green
        $testResults += @{Test="File Upload (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ File Upload (No Auth): FAILED" -ForegroundColor Red
        $testResults += @{Test="File Upload (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Test 7: CSV Export Endpoint (Protected)
Write-Host "`n7. Testing CSV Export Endpoint (GET /orders/export/csv)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders/export/csv" -Method GET
    Write-Host "❌ CSV Export (No Auth): FAILED - Should require authentication" -ForegroundColor Red
    $testResults += @{Test="CSV Export (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ CSV Export (No Auth): PASSED - Correctly requires authentication" -ForegroundColor Green
        $testResults += @{Test="CSV Export (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ CSV Export (No Auth): FAILED" -ForegroundColor Red
        $testResults += @{Test="CSV Export (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Test 8: Invalid Endpoint
Write-Host "`n8. Testing Invalid Endpoint (GET /invalid)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/invalid" -Method GET
    Write-Host "❌ Invalid Endpoint: FAILED - Should return 404" -ForegroundColor Red
    $testResults += @{Test="Invalid Endpoint"; Status="FAILED"; Details="Status $($response.StatusCode) - Should be 404"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ Invalid Endpoint: PASSED - Correctly returns 404" -ForegroundColor Green
        $testResults += @{Test="Invalid Endpoint"; Status="PASSED"; Details="Status 404 - Correctly handled"}
    } else {
        Write-Host "❌ Invalid Endpoint: FAILED" -ForegroundColor Red
        $testResults += @{Test="Invalid Endpoint"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Summary Report
Write-Host "`n================================================" -ForegroundColor Green
Write-Host "📊 TEST SUMMARY REPORT" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

$passed = ($testResults | Where-Object { $_.Status -eq "PASSED" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAILED" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passed/$total)*100, 2))%" -ForegroundColor Cyan

Write-Host "`nDetailed Results:" -ForegroundColor Yellow
foreach ($result in $testResults) {
    $statusIcon = if ($result.Status -eq "PASSED") { "✅" } else { "❌" }
    Write-Host "$statusIcon $($result.Test): $($result.Status) - $($result.Details)" -ForegroundColor $(if ($result.Status -eq "PASSED") { "Green" } else { "Red" })
}

if ($failed -eq 0) {
    Write-Host "`n🎉 All tests passed! Your API is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the issues above." -ForegroundColor Yellow
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "Testing completed!" -ForegroundColor Green
