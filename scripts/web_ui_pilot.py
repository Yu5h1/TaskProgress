"""Prepare a pinned UI delivery, or serve it with TaskProgress's existing API.

Foreground loopback only. Production routes/registry/Viewer are never changed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import secrets
import shutil
import subprocess
import sys
from pathlib import Path
from starlette.requests import Request

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "bin/Migration/WebUiWorkflow"
LOCK = ROOT / "experiments/web-ui-workflow/delivery.json"
FIXTURE = ROOT / "tests/fixtures/web-ui-pilot"
CLI = ROOT / "Build/win-x64/task-progress.exe"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return (json.dumps(value, sort_keys=True, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def revision(folder):
    return subprocess.check_output(["git", "-C", str(folder), "rev-parse", "HEAD"], text=True).strip()


def collect(web_dist):
    web_dist = Path(web_dist).resolve()
    demo = web_dist / "demo/taskprogress"
    source = json.loads((demo / "viewer-source.json").read_text(encoding="utf-8"))
    # The imported adapter must use the same product host contracts as this repo.
    for name, expected in source["files"].items():
        if name.startswith("viewer/"):
            path = ROOT / name
            if not path.is_file() or digest(path.read_bytes()) != expected:
                raise ValueError(f"TaskProgress host drift: {name}; review/refresh the adapter delivery first")
    files = {}
    for family in ["assets", "checklist", "decisions", "reference"]:
        for path in (demo / family).rglob("*"):
            if path.is_file():
                files["demo/taskprogress/" + path.relative_to(demo).as_posix()] = path.read_bytes()
    for name in ["index.html", "demo.js", "demo.css", "component-styles.css", "viewer-source.json", "build-inputs.json"]:
        files["demo/taskprogress/" + name] = (demo / name).read_bytes()
    for family in ["ui", "theme"]:
        for path in (web_dist / family).rglob("*"):
            if path.is_file():
                files[path.relative_to(web_dist).as_posix()] = path.read_bytes()
    for name in ["demo-theme.mjs", "demo-theme-start.js", "demo-bar.mjs"]:
        files[name] = (web_dist / name).read_bytes()
    for name in ["LICENSE", "LICENSE.md"]:
        if (web_dist.parent / name).is_file():
            files[name] = (web_dist.parent / name).read_bytes()
    home = '''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TaskProgress Web UI 試點</title><link rel="stylesheet" href="/theme/theme.css"><link rel="stylesheet" href="/pilot-home.css"><script src="/theme/bootstrap.js"></script><script src="/demo-theme-start.js"></script><script type="module" src="/pilot-home.mjs"></script></head><body><main><h1>TaskProgress Web UI Workflow 試點</h1><p>獨立資料副本；正式 Svelte 及 8001 不變。此頁不表示遷移驗收已完成。</p><nav><a href="/demo/taskprogress/?scope=task-progress">Viewer</a><a href="/demo/taskprogress/checklist/?scope=task-progress&task=card-disclosure">Checklist</a><a href="/demo/taskprogress/decisions/?scope=task-progress&task=decision-example">Decision</a><a href="/demo/taskprogress/reference/?scope=task-progress">同資料原版比較</a><a href="http://127.0.0.1:8001/?scope=task-progress">正式 Svelte 版</a></nav><p>三頁保存煙霧測試使用另一份 web-ui-pilot-test fixture，不寫本輪驗收結果。</p><a href="/demo/taskprogress/?scope=web-ui-pilot-test">開啟測試 fixture</a></main></body></html>'''
    files["index.html"] = home.encode("utf-8")
    files["pilot-home.mjs"] = b"import {mountDemoTheme} from './demo-theme.mjs';mountDemoTheme({backHref:null});\n"
    files["pilot-home.css"] = b"body{margin:0;background:var(--ui-page);color:var(--ui-text);font:16px/1.5 system-ui}main{max-width:960px;margin:32px auto;padding:16px}nav{display:flex;gap:20px;flex-wrap:wrap}a{color:var(--ui-accent)}\n"
    notice = '<aside class="replica-notice" aria-label="TaskProgress 試點">TaskProgress 消費端試點 · 測試資料副本 · <a href="http://127.0.0.1:8001/?scope=task-progress">正式 Svelte 版</a></aside>'
    for name in ["index.html", "checklist/index.html", "decisions/index.html"]:
        key = "demo/taskprogress/" + name
        files[key] = files[key].decode("utf-8").replace("<body>", "<body>" + notice).encode("utf-8")
    return source, files


def prepare(web_dist, import_delivery=False):
    source, files = collect(web_dist)
    manifest = {name: digest(data) for name, data in sorted(files.items())}
    identity = digest(encoded(manifest))
    if LOCK.exists() and not import_delivery:
        lock = json.loads(LOCK.read_text(encoding="utf-8"))
        if lock["payload_sha256"] != identity:
            raise ValueError("Delivery differs from the pinned import; review and use --import-delivery explicitly")
    elif not import_delivery:
        raise ValueError("No delivery pin; use --import-delivery for the initial reviewed import")
    else:
        lock = {"version": 1, "web_revision": revision(Path(web_dist).resolve().parent),
                "taskprogress_revision": revision(ROOT), "adapter_source_commit": source["commit"],
                "payload_sha256": identity, "file_count": len(files)}
    delivery = BUILD / "deliveries" / identity
    if delivery.exists():
        verify_site(delivery, lock)
    else:
        site = delivery / "site"
        site.mkdir(parents=True)
        for name, data in files.items():
            target = site / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        (delivery / "manifest.json").write_bytes(encoded(manifest))
    if import_delivery:
        LOCK.parent.mkdir(parents=True, exist_ok=True)
        LOCK.write_bytes(encoded(lock))
    print(f"Pinned {len(files)} assets at {delivery}", flush=True)
    return delivery


def verify_site(delivery=None, lock=None):
    lock = lock or json.loads(LOCK.read_text(encoding="utf-8"))
    delivery = delivery or BUILD / "deliveries" / lock["payload_sha256"]
    manifest = json.loads((delivery / "manifest.json").read_text(encoding="utf-8"))
    if digest(encoded(manifest)) != lock["payload_sha256"]:
        raise ValueError("Delivery manifest drift")
    site = delivery / "site"
    actual = {p.relative_to(site).as_posix(): digest(p.read_bytes()) for p in site.rglob("*") if p.is_file()}
    if actual != manifest:
        raise ValueError("Delivery asset drift")
    return site


def data_directories(base):
    # Persist across starts. Copy once and refuse to adopt unidentified folders.
    marker = base / "source.json"
    if marker.exists():
        data = json.loads(marker.read_text(encoding="utf-8"))
        if data.get("kind") != "taskprogress-web-ui-pilot-v1":
            raise ValueError("Unrecognized pilot data")
        return [(name, base / name) for name in ["task-progress", "example", "web-ui-pilot-test"]]
    if base.exists():
        raise ValueError("Unidentified pilot data exists; preserve it and select a new data directory")
    base.mkdir(parents=True)
    primary = base / "task-progress"
    primary.mkdir()
    for name in ["report.json", "report.dev.json", "report.modules.json", "time.config.json", "time.estimates.json", "time.analysis.json", "cost.analysis.json"]:
        if (ROOT / name).is_file():
            shutil.copyfile(ROOT / name, primary / name)
    for name in ["checklists", "decisions", "Documentation"]:
        shutil.copytree(ROOT / name, primary / name)
    shutil.copytree(ROOT / "reports/example", base / "example")
    shutil.copytree(FIXTURE, base / "web-ui-pilot-test")
    marker.write_bytes(encoded({"kind": "taskprogress-web-ui-pilot-v1", "source_revision": revision(ROOT)}))
    return [(name, base / name) for name in ["task-progress", "example", "web-ui-pilot-test"]]


def create_app(port=8017, data_root=None):
    # Runtime only reads this repo's prepared delivery and its own data.
    sys.path.insert(0, str(ROOT))
    from service.taskprogress_host import install_edit_api, _load_module
    from fastapi.responses import RedirectResponse
    from fastapi.routing import APIRoute
    site = verify_site()
    files = {}
    for scope, folder in data_directories(data_root or BUILD / "data"):
        for name in ["report.json", "report.dev.json", "report.modules.json", "time.analysis.json", "cost.analysis.json"]:
            if (folder / name).is_file():
                for prefix in ["/reports/", "/demo/reports/", "/demo/taskprogress/reports/", "/demo/taskprogress/reference/reports/"]:
                    files[f"{prefix}{scope}/{name}"] = folder / name
    local = _load_module(ROOT.parent / "LocalWebService/localHost.py")
    app = local.create_app(site, files=files, control_token=secrets.token_urlsafe(32), control_port=port, cors_origins=())
    install_edit_api(app, report_schema=ROOT / "schemas/report.schema.json", control_port=port, analyzer_command=[str(CLI)])
    async def alias(request: Request):
        path = "/demo/taskprogress/" if request.url.path == "/" else "/demo/taskprogress" + request.url.path
        return RedirectResponse(path + ("?" + request.url.query if request.url.query else ""))
    for path in ["/", "/checklist/", "/decisions/"]:
        app.router.routes.insert(0, APIRoute(path, alias, methods=["GET"]))
    return app


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--prepare", action="store_true")
    mode.add_argument("--import-delivery", action="store_true")
    mode.add_argument("--serve", action="store_true")
    parser.add_argument("--web-dist", type=Path, default=ROOT.parent / "Web/dist")
    parser.add_argument("--port", type=int, default=8017)
    args = parser.parse_args()
    if args.serve:
        import uvicorn
        app = create_app(args.port)
        print(f"TaskProgress Web UI PILOT: http://127.0.0.1:{args.port}/demo/taskprogress/?scope=task-progress", flush=True)
        print(f"Data copies: {BUILD / 'data'}; production 8001 remains unchanged. Ctrl+C stops.", flush=True)
        uvicorn.run(app, host="127.0.0.1", port=args.port)
    else:
        prepare(args.web_dist, args.import_delivery)


if __name__ == "__main__":
    main()
