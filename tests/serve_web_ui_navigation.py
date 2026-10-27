"""Foreground browser checks for the built candidate, with disposable data only."""
import importlib.util
import tempfile
from pathlib import Path

import uvicorn
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.routing import APIRoute
from starlette.staticfiles import StaticFiles
from starlette.routing import Mount

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('candidate_pilot', ROOT / 'scripts/web_ui_pilot.py')
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


def create_check_app(data_root):
    app = pilot.create_app(8019, data_root=data_root, candidate=True)
    site = pilot.candidate_site()

    async def page():
        # Use the actual candidate shell, asset policy and renderer. The test
        # module is the only addition; it never enters the delivery manifest.
        html = (site / 'demo/taskprogress/index.html').read_text(encoding='utf-8')
        html = html.replace('<head>', '<head><base href="/demo/taskprogress/">')
        html = html.replace('</body>', '<h1>Candidate navigation checks</h1><ol id="results"></ol><div id="fixture"></div><script type="module" src="/__candidate-navigation.mjs"></script></body>')
        return HTMLResponse(html)

    async def script():
        return FileResponse(ROOT / 'tests/web-ui-navigation.browser.mjs', media_type='text/javascript')

    # Exact checks must precede the candidate's catch-all static mount.
    app.router.routes.insert(0, APIRoute('/__candidate-navigation.html', page, methods=['GET']))
    app.router.routes.insert(0, APIRoute('/__candidate-navigation.mjs', script, methods=['GET']))
    # Comparison-only archive. It is never copied into the current delivery.
    baseline = ROOT / 'bin/Migration/SvelteRetirement/rollback-ca05a3f/viewer'
    app.router.routes.insert(0, Mount('/__svelte-baseline', StaticFiles(directory=baseline)))
    return app


if __name__ == '__main__':
    with tempfile.TemporaryDirectory(prefix='taskprogress-navigation-') as temporary:
        print('Disposable candidate checks: http://127.0.0.1:8019/__candidate-navigation.html', flush=True)
        uvicorn.run(create_check_app(Path(temporary) / 'data'), host='127.0.0.1', port=8019, access_log=False)
