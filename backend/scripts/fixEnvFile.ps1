# PowerShell script to fix .env file issues

$envPath = Join-Path $PSScriptRoot ".." ".env"

if (Test-Path $envPath) {
    Write-Host "Found .env file at: $envPath"
    Write-Host "`nCurrent content:"
    Get-Content $envPath
    
    Write-Host "`nChecking for issues..."
    
    $content = Get-Content $envPath
    $fixed = $false
    
    foreach ($line in $content) {
        if ($line -match "^MONGO_URI=MONGO_URI=") {
            Write-Host "`n❌ Found duplicate MONGO_URI prefix!"
            Write-Host "Fixing line: $line"
            $fixed = $true
        }
    }
    
    if ($fixed) {
        Write-Host "`n⚠️  Please manually fix the .env file:"
        Write-Host "Remove the duplicate 'MONGO_URI=' prefix"
        Write-Host "`nThe MONGO_URI line should be:"
        Write-Host "MONGO_URI=mongodb+srv://nitheeshs:nitheesh149@bus.bpygbsj.mongodb.net/IMS?retryWrites=true&w=majority&appName=BUS"
    } else {
        Write-Host "✅ No obvious issues found"
    }
} else {
    Write-Host "❌ .env file not found at: $envPath"
    Write-Host "Please create a .env file in the backend directory"
}

