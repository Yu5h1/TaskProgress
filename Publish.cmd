@echo off
setlocal

set "PROJECT_ROOT=%~dp0"
set "PROJECT_FILE=%PROJECT_ROOT%src\TaskProgress.Cli\TaskProgress.Cli.csproj"
set "OUTPUT_DIR=%PROJECT_ROOT%Build\win-x64"
set "OUTPUT_EXE=%OUTPUT_DIR%\task-progress.exe"

echo Publishing TaskProgress single-file EXE...
echo Project: %PROJECT_FILE%
echo Output : %OUTPUT_DIR%
echo.

dotnet publish "%PROJECT_FILE%" -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o "%OUTPUT_DIR%"
set "BUILD_EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%BUILD_EXIT_CODE%"=="0" (
    echo BUILD FAILED - exit code %BUILD_EXIT_CODE%
    pause
    exit /b %BUILD_EXIT_CODE%
)

if not exist "%OUTPUT_EXE%" (
    echo BUILD FAILED - task-progress.exe was not created.
    pause
    exit /b 1
)

echo BUILD SUCCESS
echo %OUTPUT_EXE%
pause
exit /b 0
