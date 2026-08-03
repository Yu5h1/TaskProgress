@echo off
setlocal

set "PROJECT_ROOT=%~dp0"
set "EDITOR_ENTRY=%PROJECT_ROOT%experiments\editor-svelte-spike\dist\editor.html"

where npm.cmd >nul 2>nul
if errorlevel 1 (
    echo EDITOR BUILD FAILED - npm.cmd was not found.
    exit /b 1
)

if not exist "%PROJECT_ROOT%package-lock.json" (
    echo EDITOR BUILD FAILED - package-lock.json was not found.
    exit /b 1
)

pushd "%PROJECT_ROOT%"
if errorlevel 1 (
    echo EDITOR BUILD FAILED - could not enter the project directory.
    exit /b 1
)

if not "%TASK_PROGRESS_SKIP_NPM_CI%"=="1" (
    echo Installing locked Editor build dependencies...
    call npm.cmd ci --no-audit --no-fund
    if errorlevel 1 goto :failed
)

echo Building and verifying local Svelte Editor assets...
call npm.cmd run editor:svelte:build
if errorlevel 1 goto :failed

if not exist "%EDITOR_ENTRY%" (
    echo EDITOR BUILD FAILED - editor.html was not created.
    popd
    exit /b 1
)

echo EDITOR BUILD SUCCESS
echo %EDITOR_ENTRY%
popd
exit /b 0

:failed
set "EDITOR_BUILD_EXIT_CODE=%ERRORLEVEL%"
popd
exit /b %EDITOR_BUILD_EXIT_CODE%
