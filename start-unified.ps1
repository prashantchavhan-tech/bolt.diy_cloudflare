# Unified Startup Script for Bolt.diy + OpenClaw

# Kill existing processes on target ports
Write-Host "Cleaning up existing processes on ports 5173 and 18789..." -ForegroundColor Cyan
$ports = @(5173, 18789)
foreach ($port in $ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) {
        Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        Write-Host "Killed process on port $port"
    }
}

# Ensure logs directory exists
if (-not (Test-Path "openclaw/logs")) {
    New-Item -ItemType Directory -Path "openclaw/logs" -Force
}

# Start OpenClaw Gateway in the background
Write-Host "Starting OpenClaw Gateway..." -ForegroundColor Green
Start-Job -Name OpenClaw -ScriptBlock {
    cd "c:\Users\pccha\Documents\trae_projects\Bolt_openclaw ai\openclaw"
    .\start.ps1
}

# Wait for OpenClaw to initialize
Write-Host "Waiting for OpenClaw to start..." -ForegroundColor Yellow
$waitCount = 0
while ($waitCount -lt 30) {
    $conn = Get-NetTCPConnection -LocalPort 18789 -ErrorAction SilentlyContinue
    if ($conn) { break }
    Start-Sleep -Seconds 1
    $waitCount++
}

# Start Bolt.diy
Write-Host "Starting Bolt.diy..." -ForegroundColor Green
cd "c:\Users\pccha\Documents\trae_projects\Bolt_openclaw ai\bolt.diy"
$env:WRANGLER_HOME=".wrangler"
$env:XDG_CONFIG_HOME=".config"
npx cross-env WRANGLER_HOME=.wrangler XDG_CONFIG_HOME=.config pnpm dev
