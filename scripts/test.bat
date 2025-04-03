@echo off
ECHO ====================================
ECHO Running tests
ECHO ====================================
call npm test image-utils.test.ts products-service.test.ts
IF %ERRORLEVEL% NEQ 0 (
  ECHO Warning: Some tests failed
  EXIT /B %ERRORLEVEL%
)
ECHO All tests passed! 