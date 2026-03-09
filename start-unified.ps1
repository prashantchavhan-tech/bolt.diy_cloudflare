# Unified Startup Script for Bolt.diy + OpenClaw

param(
    [ValidateSet('bolt-only', 'unified')]
    [string]$Mode = 'bolt-only'
)

$repoRoot = $PSScriptRoot
$boltPath = Join-Path $repoRoot 'bolt.diy'
$openClawPath = Join-Path $repoRoot 'openclaw'

if (-not (Test-Path $boltPath)) {
    Write-Host "❌ bolt.diy was not found at $boltPath" -ForegroundColor Red
    exit 1
}

if ($Mode -eq 'unified' -and -not (Test-Path $openClawPath)) {
    Write-Host "❌ openclaw was not found at $openClawPath" -ForegroundColor Red
    exit 1
}

# Kill existing processes on target ports
$ports = if ($Mode -eq 'unified') { @(5173, 18789) } else { @(5173) }
Write-Host "Cleaning up existing processes on ports $($ports -join ', ')..." -ForegroundColor Cyan

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }

    if ($connections) {
        Write-Host "Killed process(es) on port $port"
    }
}

if ($Mode -eq 'unified') {
    # Ensure logs directory exists
    $logPath = Join-Path $openClawPath 'logs'
    if (-not (Test-Path $logPath)) {
        New-Item -ItemType Directory -Path $logPath -Force | Out-Null
    }

    # Start OpenClaw Gateway in the background
    Write-Host "Starting OpenClaw Gateway..." -ForegroundColor Green
    Start-Job -Name OpenClaw -ScriptBlock {
        param($Path)
        Set-Location $Path
        .\start.ps1
    } -ArgumentList $openClawPath | Out-Null

    # Wait for OpenClaw to initialize
    Write-Host "Waiting for OpenClaw to start..." -ForegroundColor Yellow
    $waitCount = 0
    while ($waitCount -lt 30) {
        $conn = Get-NetTCPConnection -LocalPort 18789 -ErrorAction SilentlyContinue
        if ($conn) { break }
        Start-Sleep -Seconds 1
        $waitCount++
    }
}

# Start Bolt.diy
Write-Host "Starting Bolt.diy in mode '$Mode'..." -ForegroundColor Green
Set-Location $boltPath
$env:WRANGLER_HOME = '.wrangler'
$env:XDG_CONFIG_HOME = '.config'
npx cross-env WRANGLER_HOME=.wrangler XDG_CONFIG_HOME=.config pnpm dev
