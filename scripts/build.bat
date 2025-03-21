@echo off
ECHO ====================================
ECHO Building Automotive-Stock-Catalog
ECHO ====================================
ECHO Building application...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
  ECHO Error: Build failed
  EXIT /B %ERRORLEVEL%
)
ECHO Build completed successfully! (To start the development server, run: scripts\dev.bat)