@echo off
setlocal EnableExtensions DisableDelayedExpansion

set "INSTALL_EXIT_CODE=1"
pushd "%~dp0" || goto finish
echo Installing locked TaskProgress npm dependencies...
call npm.cmd ci --include=dev --ignore-scripts --no-audit --no-fund
set "INSTALL_EXIT_CODE=%ERRORLEVEL%"
if not "%INSTALL_EXIT_CODE%"=="0" goto leaveProject

call npm.cmd run ui:build
set "INSTALL_EXIT_CODE=%ERRORLEVEL%"
if not "%INSTALL_EXIT_CODE%"=="0" goto leaveProject

echo Building TaskProgress for Windows x64 publishing...
dotnet build "src\TaskProgress.Cli\TaskProgress.Cli.csproj" -c Release -p:PublishProfile=WinX64 "-p:RestoreConfigFile=%~dp0NuGet.Config" --artifacts-path "%~dp0bin\Publish"
set "INSTALL_EXIT_CODE=%ERRORLEVEL%"

:leaveProject
popd

:finish
if "%INSTALL_EXIT_CODE%"=="0" (
    echo TaskProgress is ready to publish.
) else (
    echo TaskProgress initialization failed ^(exit code %INSTALL_EXIT_CODE%^). 1>&2
)
if /i not "%~1"=="--nopause" pause
exit /b %INSTALL_EXIT_CODE%
