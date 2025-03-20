@echo off
ECHO ====================================
ECHO Automotive-Stock-Catalog: Full Setup
ECHO ====================================
ECHO Step 1: Setup
call scripts\setup.bat
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

ECHO Step 2: Build
call scripts\build.bat
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

ECHO Step 3: Test
call scripts\test.bat
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

ECHO ====================================
ECHO Setup completed successfully!
ECHO To start the development server, run:
ECHO   scripts\dev.bat
ECHO ==================================== 