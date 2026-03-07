# Auto Bug Fixing Agent for Bolt.diy + OpenClaw

param(
    [Parameter(Mandatory=$true)]
    [string]$BugReport
)

Write-Host "🚀 Launching Auto Bug-Fixing Agent (OpenProse Bug Hunter)..." -ForegroundColor Cyan

# Ensure OpenClaw Gateway is running (it should be if you used start-unified.ps1)
$conn = Get-NetTCPConnection -LocalPort 18789 -ErrorAction SilentlyContinue
if (-not $conn) {
    Write-Host "❌ OpenClaw Gateway is not running. Please run .\start-unified.ps1 first." -ForegroundColor Red
    exit
}

# Construct the command
$prosePath = "extensions/open-prose/skills/prose/examples/36-bug-hunter.prose"
$message = "/prose run $prosePath --bug_report '$BugReport'"

Write-Host "🤖 Investigating: $BugReport" -ForegroundColor Yellow

# Execute via OpenClaw CLI
cd "c:\Users\pccha\Documents\trae_projects\Bolt_openclaw ai\openclaw"
node openclaw.mjs agent --message "$message" --thinking high

Write-Host "✅ Investigation Complete. Check Bolt.diy for suggested fixes." -ForegroundColor Green
