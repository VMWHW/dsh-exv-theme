@echo off
setlocal
echo ============================================
echo   DSH EXV Theme 2.0 - Automated Installer
echo ============================================
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
set CODE=%ERRORLEVEL%
echo.
if not "%CODE%"=="0" echo Installation failed with code %CODE%.
pause
exit /b %CODE%
