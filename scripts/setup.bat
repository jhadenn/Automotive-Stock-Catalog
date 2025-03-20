@echo off
ECHO ====================================
ECHO Setting up Automotive-Stock-Catalog
ECHO ====================================
ECHO Installing dependencies...
call npm install
IF %ERRORLEVEL% NEQ 0 (
  ECHO Error: Failed to install dependencies
  EXIT /B %ERRORLEVEL%
)
ECHO Setup completed successfully! 