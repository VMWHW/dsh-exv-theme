@echo off
setlocal
echo ============================================
echo   DSH EXV Theme 2.0 - Uninstall
echo ============================================
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall.ps1"
set CODE=%ERRORLEVEL%
echo.
if not "%CODE%"=="0" echo Uninstall failed with code %CODE%.
pause
exit /b %CODE%
