@echo off
title SortingSource - Install Local Engine Auto-Start

echo.
echo  ============================================
echo   SORTING SOURCE - Local Engine Installer
echo  ============================================
echo.
echo  This will make the Local Engine start silently
echo  every time you log into Windows.
echo.

set "VBS_SOURCE=%~dp0start_local_engine.vbs"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_DEST=%STARTUP_DIR%\SortingSource_LocalEngine.vbs"

echo  Installing to: %STARTUP_DIR%
echo.

copy /Y "%VBS_SOURCE%" "%VBS_DEST%"

if %ERRORLEVEL% == 0 (
    echo  [SUCCESS] Local Engine will now start automatically on login!
    echo.
    echo  Starting the engine RIGHT NOW for this session...
    wscript.exe "%VBS_DEST%"
    echo.
    echo  Done! Check your dashboard and flip "Local Engine" ON.
) else (
    echo  [ERROR] Installation failed. Try running as Administrator.
)

echo.
pause
