@echo off
title SortingSource - Install FAST Search Auto-Start

echo.
echo  ============================================
echo   SORTING SOURCE - FAST Search Installer
echo  ============================================
echo.
echo  This will make FAST Search (PC Only) start silently
echo  every time you log into Windows.
echo.

set "PROJECT_DIR=%~dp0"
:: Strip trailing backslash if present
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_DEST=%STARTUP_DIR%\SortingSource_LocalEngine.vbs"

echo  Project Directory: %PROJECT_DIR%
echo  Installing to: %STARTUP_DIR%
echo.

:: Clean up old files if they exist
if exist "%VBS_DEST%" del /f /q "%VBS_DEST%"

:: Generate VBScript with the correct project directory embedded
echo Dim oShell > "%VBS_DEST%"
echo Set oShell = CreateObject("WScript.Shell") >> "%VBS_DEST%"
echo oShell.Run "cmd /c cd /d " ^& Chr(34) ^& "%PROJECT_DIR%" ^& Chr(34) ^& " ^&^& python -m uvicorn main:app --host 0.0.0.0 --port 8000 ^>^>" ^& Chr(34) ^& "%PROJECT_DIR%\local_engine.log" ^& Chr(34) ^& " 2^>^&1", 0, False >> "%VBS_DEST%"

if %ERRORLEVEL% == 0 (
    echo  [SUCCESS] FAST Search will now start automatically on login!
    echo.
    echo  Starting the engine RIGHT NOW for this session...
    wscript.exe "%VBS_DEST%"
    echo.
    echo  Done! Check your dashboard and flip "FAST Search (PC Only)" ON.
) else (
    echo  [ERROR] Installation failed.
)

echo.
pause
