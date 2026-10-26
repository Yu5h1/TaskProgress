@echo off
cd /d "%~dp0"
echo TaskProgress source-built candidate: http://127.0.0.1:8018/demo/taskprogress/?scope=task-progress
echo Production Svelte on 8001 and the imported pilot on 8017 remain available.
python scripts/web_ui_pilot.py --serve --candidate --port 8018
pause
