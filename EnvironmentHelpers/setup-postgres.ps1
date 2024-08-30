
# Load database variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -notmatch '^#') {
            $name, $value = $_ -split '='
            Set-Item -Path "env:$name" -Value $value
        }
    }
} else {
    Write-Host "Error: .env file not found."
    exit 1
}

# Check if the required environment variables are set
if (-not $env:DATABASE_NAME -or -not $env:DATABASE_USERNAME -or -not $env:DATABASE_PASSWORD) {
    Write-Host "Error: One or more required environment variables (DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD) are not set."
    exit 1
}


Write-Host "Database Name: $env:DATABASE_NAME"
Write-Host "Database Username: $env:DATABASE_USERNAME"
Write-Host "Database Password: $env:DATABASE_PASSWORD"


docker pull postgres:latest

# Run the PostgreSQL container
Write-Host "Starting PostgreSQL container..."
if (-not (docker run --name postgres -e POSTGRES_USER=$env:DATABASE_USERNAME -e POSTGRES_PASSWORD=$env:DATABASE_PASSWORD -e POSTGRES_DB=$env:DATABASE_NAME -p 5432:5432 -d postgres:latest)) {
    Write-Host "Error: Failed to start PostgreSQL container."
    exit 1
}

Write-Host "PostgreSQL container running successfully...."

# Wait for 10 seconds so that database can propagate and migration won't fail
Start-Sleep -Seconds 10

# Navigate to the parent directory of the Prisma directory
Write-Host "Navigating to the parent directory of the Project..."
Set-Location -Path $PSScriptRoot
Set-Location -Path "$PSScriptRoot\.."

# Navigate to the src\prisma directory
Write-Host "Navigating to the src\prisma directory..."
Set-Location -Path "src\prisma"

# Attempt Prisma migration
Write-Host "Attempting Prisma Migration..."
if (-not (bunx prisma migrate deploy)) {
    Write-Host "Error: Prisma migration failed."
    exit 1
}

Write-Host "Prisma migration was successful and the database is ready to use."

# Generate Prisma client
Write-Host "Generating Prisma client..."
if (-not (bunx prisma generate)) {
    Write-Host "Error: Prisma client generation failed."
    exit 1
}

Write-Host "Prisma client generated successfully."