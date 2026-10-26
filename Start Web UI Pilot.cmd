@echo off
cd /d "%~dp0"
python scripts\web_ui_pilot.py --serve --port 8017
exit /b %errorlevel%
