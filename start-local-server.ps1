$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

Write-Host "Starting Neko Can Shop local server..." -ForegroundColor Cyan
Write-Host "Project: $PSScriptRoot"
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js was not found. Please install Node.js first." -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}

try {
  node ".\src\dev-server.js"
} catch {
  Write-Host ""
  Write-Host "Server failed to start:" -ForegroundColor Red
  Write-Host $_.Exception.Message
  Read-Host "Press Enter to close"
  exit 1
}
