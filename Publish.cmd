@echo off
setlocal

rem Publish.cmd [--nopause] [--restart]
rem   Closes the running TaskProgress tray through TrayHost's exit command, publishes the
rem   single-file EXE, and with --restart starts the service again. --nopause skips the final
rem   pause so an agent or script can read the exit code.

set "PROJECT_ROOT=%~dp0"
set "PROJECT_FILE=%PROJECT_ROOT%src\TaskProgress.Cli\TaskProgress.Cli.csproj"
set "OUTPUT_DIR=%PROJECT_ROOT%Build\win-x64"
set "OUTPUT_EXE=%OUTPUT_DIR%\task-progress.exe"
set "MANIFEST=%OUTPUT_DIR%\taskprogress.trayapp"
set "LEGACY_MANIFEST=%OUTPUT_DIR%\taskprogress.trayapp.json"
set "TRAY_HOST=%TASK_PROGRESS_TRAY_HOST%"
if not defined TRAY_HOST set "TRAY_HOST=%PROJECT_ROOT%..\Winform\bin\TrayHost\Release\Yu5h1Lib.TrayHost.exe"
set "PAUSE_AT_END=1"
set "RESTART=0"
set "EXIT_CODE=0"

:parse
if "%~1"=="" goto parsed
if /i "%~1"=="--nopause" (
    set "PAUSE_AT_END=0"
    shift
    goto parse
)
if /i "%~1"=="--restart" (
    set "RESTART=1"
    shift
    goto parse
)
echo Unknown option: %~1
echo Usage: Publish.cmd [--nopause] [--restart]
set "EXIT_CODE=2"
goto finish

:parsed
echo Building the Web UI Workflow delivery...
pushd "%PROJECT_ROOT%"
call npm run ui:build
set "EXIT_CODE=%ERRORLEVEL%"
popd
if not "%EXIT_CODE%"=="0" goto finish

echo Publishing TaskProgress single-file EXE...
echo Project: %PROJECT_FILE%
echo Output : %OUTPUT_DIR%
echo.

if not exist "%MANIFEST%" if exist "%LEGACY_MANIFEST%" set "MANIFEST=%LEGACY_MANIFEST%"
if not exist "%MANIFEST%" goto publish
if not exist "%TRAY_HOST%" (
    echo TrayHost not found: %TRAY_HOST%
    echo A running TaskProgress service may keep task-progress.exe locked.
    goto publish
)
echo Closing the running TaskProgress tray...
"%TRAY_HOST%" exit "%MANIFEST%" --standalone
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
    echo CLOSE FAILED - exit code %EXIT_CODE%
    echo Exit TaskProgress from its tray menu, then run Publish.cmd again.
    goto finish
)

:publish
dotnet publish "%PROJECT_FILE%" -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=false -p:EnableCompressionInSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o "%OUTPUT_DIR%"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
    echo BUILD FAILED - exit code %EXIT_CODE%
    goto finish
)

if not exist "%OUTPUT_EXE%" (
    echo BUILD FAILED - task-progress.exe was not created.
    set "EXIT_CODE=1"
    goto finish
)

if exist "%LEGACY_MANIFEST%" del "%LEGACY_MANIFEST%"

echo BUILD SUCCESS
echo %OUTPUT_EXE%

if "%RESTART%"=="0" goto finish
echo.
echo Restarting the TaskProgress service...
"%OUTPUT_EXE%" start --no-browser
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" echo RESTART FAILED - exit code %EXIT_CODE%

:finish
if "%PAUSE_AT_END%"=="1" pause
exit /b %EXIT_CODE%
