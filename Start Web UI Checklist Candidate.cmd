@echo off
cd /d "%~dp0"
node scripts/open-web-ui-desktop.mjs checklist
if errorlevel 1 pause
