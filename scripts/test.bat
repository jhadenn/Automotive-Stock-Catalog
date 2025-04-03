@echo off
ECHO ====================================
ECHO Running tests
ECHO ====================================
call npm test 
IF %ERRORLEVEL% NEQ 0 (
  ECHO Warning: Some tests failed
  EXIT /B %ERRORLEVEL%
)
ECHO All tests passed! 