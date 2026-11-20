@echo off
setlocal EnableExtensions DisableDelayedExpansion

set "INSTALL_EXIT_CODE=1"
pushd "%~dp0" || goto finish

echo Installing locked TaskProgress and LocalWebService Python dependencies...
set "PIP_CONFIG_FILE=nul"
powershell.exe -NoProfile -Command ^
    "$ErrorActionPreference = 'Stop';" ^
    "$python = [Environment]::ExpandEnvironmentVariables([string]$env:TASK_PROGRESS_PYTHON);" ^
    "if ([string]::IsNullOrWhiteSpace($python)) { $python = 'python' };" ^
    "$service = [Environment]::ExpandEnvironmentVariables([string]$env:TASK_PROGRESS_LOCAL_WEB_SERVICE);" ^
    "if ([string]::IsNullOrWhiteSpace($service)) { $service = '..\LocalWebService\localHost.py' };" ^
    "$requirements = Join-Path (Split-Path ([IO.Path]::GetFullPath($service))) 'requirements.txt';" ^
    "if (!(Test-Path -LiteralPath $requirements -PathType Leaf)) { Write-Error 'LocalWebService requirements.txt was not found. Update the LocalWebService checkout or set TASK_PROGRESS_LOCAL_WEB_SERVICE to its localHost.py.'; exit 1 };" ^
    "& $python -m pip --isolated --disable-pip-version-check install --index-url https://pypi.org/simple --only-binary=:all: --require-hashes -r $requirements -r requirements.txt; exit $LASTEXITCODE"
set "INSTALL_EXIT_CODE=%ERRORLEVEL%"
if not "%INSTALL_EXIT_CODE%"=="0" goto leaveProject

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
