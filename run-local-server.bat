@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting Neko Can Shop local server...
echo.
node "src\dev-server.js"
echo.
echo Local server stopped. Keep this window open while using the generator.
pause
