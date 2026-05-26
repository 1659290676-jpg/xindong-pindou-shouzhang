@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Please install Node.js first.
  pause
  exit /b 1
)

start "Neko Can Shop Local Server" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0start-local-server.ps1"
timeout /t 3 >nul
start "" "http://127.0.0.1:4173/"
