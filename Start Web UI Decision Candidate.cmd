@echo off
cd /d "%~dp0"
node scripts/open-web-ui-desktop.mjs decisions
if errorlevel 1 pause
