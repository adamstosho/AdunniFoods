# Comprehensive API Endpoint Testing
$baseUrl = "http://localhost:5000/api"
$results = @()

Write-Host "🚀 Testing Adunni Foods API Endpoints..." -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Check (GET /)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $results += @{Test="Health Check"; Status="PASSED"; Details="Status 200"}
    } else {
        Write-Host "❌ FAILED - Status: $($response.StatusCode)" -ForegroundColor Red
        $results += @{Test="Health Check"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $results += @{Test="Health Check"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 2: Products List
Write-Host "`n2. Testing Products List (GET /products)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $results += @{Test="Products List"; Status="PASSED"; Details="Status 200"}
    } else {
        Write-Host "❌ FAILED - Status: $($response.StatusCode)" -ForegroundColor Red
        $results += @{Test="Products List"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $results += @{Test="Products List"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 3: Admin Login (Invalid Credentials)
Write-Host "`n3. Testing Admin Login - Invalid Credentials" -ForegroundColor Yellow
try {
    $body = '{"username":"invalid","password":"wrong"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body
    if ($response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - Status: $($response.StatusCode) (Correctly rejected)" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $results += @{Test="Admin Login (Invalid)"; Status="PASSED"; Details="Status 401 - Correctly rejected"}
    } else {
        Write-Host "❌ FAILED - Status: $($response.StatusCode)" -ForegroundColor Red
        $results += @{Test="Admin Login (Invalid)"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - Status: 401 (Correctly rejected)" -ForegroundColor Green
        $results += @{Test="Admin Login (Invalid)"; Status="PASSED"; Details="Status 401 - Correctly rejected"}
    } else {
        Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="Admin Login (Invalid)"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
    }
}

# Test 4: Create Order
Write-Host "`n4. Testing Create Order (POST /orders)" -ForegroundColor Yellow
try {
    $orderBody = '{"customerName":"Test Customer","customerPhone":"2348144665646","address":"123 Test Street","items":[{"product":"507f1f77bcf86cd799439011","name":"Test Product","qty":1,"price":15.99}],"totalAmount":15.99,"paymentMethod":"cash_on_delivery"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method POST -ContentType "application/json" -Body $orderBody
    if ($response.StatusCode -eq 201) {
        Write-Host "✅ PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
        $results += @{Test="Create Order"; Status="PASSED"; Details="Status 201"}
    } else {
        Write-Host "❌ FAILED - Status: $($response.StatusCode)" -ForegroundColor Red
        Write-Host "   Response: $($response.Content)" -ForegroundColor Red
        $results += @{Test="Create Order"; Status="FAILED"; Details="Status $($response.StatusCode)"}
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $results += @{Test="Create Order"; Status="FAILED"; Details="Error: $($_.Exception.Message)"}
}

# Test 5: Protected Endpoints (Should return 401)
Write-Host "`n5. Testing Protected Endpoints (Should require authentication)" -ForegroundColor Yellow

# Products Create
try {
    $productBody = '{"name":"Test Product","slug":"test-product","price":19.99}'
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method POST -ContentType "application/json" -Body $productBody
    Write-Host "❌ FAILED - Products Create should require auth" -ForegroundColor Red
    $results += @{Test="Products Create (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - Products Create correctly requires auth" -ForegroundColor Green
        $results += @{Test="Products Create (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="Products Create (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Orders List
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders" -Method GET
    Write-Host "❌ FAILED - Orders List should require auth" -ForegroundColor Red
    $results += @{Test="Orders List (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - Orders List correctly requires auth" -ForegroundColor Green
        $results += @{Test="Orders List (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="Orders List (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# File Upload
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/upload" -Method POST
    Write-Host "❌ FAILED - File Upload should require auth" -ForegroundColor Red
    $results += @{Test="File Upload (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - File Upload correctly requires auth" -ForegroundColor Green
        $results += @{Test="File Upload (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="File Upload (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# CSV Export
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/orders/export/csv" -Method GET
    Write-Host "❌ FAILED - CSV Export should require auth" -ForegroundColor Red
    $results += @{Test="CSV Export (No Auth)"; Status="FAILED"; Details="Should require auth but didn't"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ PASSED - CSV Export correctly requires auth" -ForegroundColor Green
        $results += @{Test="CSV Export (No Auth)"; Status="PASSED"; Details="Status 401 - Correctly protected"}
    } else {
        Write-Host "❌ FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="CSV Export (No Auth)"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Test 6: Invalid Endpoint
Write-Host "`n6. Testing Invalid Endpoint (GET /invalid)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/invalid" -Method GET
    Write-Host "❌ FAILED - Should return 404" -ForegroundColor Red
    $results += @{Test="Invalid Endpoint"; Status="FAILED"; Details="Status $($response.StatusCode) - Should be 404"}
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ PASSED - Correctly returns 404" -ForegroundColor Green
        $results += @{Test="Invalid Endpoint"; Status="PASSED"; Details="Status 404 - Correctly handled"}
    } else {
        Write-Host "❌ FAILED - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="Invalid Endpoint"; Status="FAILED"; Details="Unexpected error"}
    }
}

# Summary Report
Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "📊 TEST SUMMARY REPORT" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

$passed = ($results | Where-Object { $_.Status -eq "PASSED" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAILED" }).Count
$total = $results.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passed/$total)*100, 2))%" -ForegroundColor Cyan

Write-Host "`nDetailed Results:" -ForegroundColor Yellow
foreach ($result in $results) {
    $statusIcon = if ($result.Status -eq "PASSED") { "✅" } else { "❌" }
    Write-Host "$statusIcon $($result.Test): $($result.Status) - $($result.Details)" -ForegroundColor $(if ($result.Status -eq "PASSED") { "Green" } else { "Red" })
}

if ($failed -eq 0) {
    Write-Host "`n🎉 All tests passed! Your API is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the issues above." -ForegroundColor Yellow
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "Testing completed!" -ForegroundColor Green
