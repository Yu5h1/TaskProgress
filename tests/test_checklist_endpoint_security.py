import json
import asyncio
import socket
import subprocess
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from unittest.mock import patch

import httpx
import uvicorn
from fastapi import FastAPI

from service.taskprogress_host import _load_module, create_taskprogress_app_factory

ROOT = Path(__file__).resolve().parents[1]
PORT = 8765
ORIGIN = f"http://127.0.0.1:{PORT}"
TOKEN = "test-control-token-0123456789abcdef"


class ChecklistEndpointSecurityTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.web = self.root / "web"
        self.web.mkdir()
        self.report = self.root / 'report.json'
        self.report.write_text(json.dumps({'scope_id': 'secure-test'}))
        self.endpoints = self.root / "private" / "endpoints"
        self.local = _load_module(ROOT.parent / "LocalWebService" / "localHost.py")
        self.factory = create_taskprogress_app_factory(
            self.local, report_schema=ROOT / "schemas" / "report.schema.json",
            endpoints_directory=self.endpoints, analyzer_command=['test-bridge'],
        )

    def tearDown(self):
        self.temp.cleanup()

    def app(self, **kwargs):
        return self.factory(self.web, files={'/reports/secure-test/report.json': self.report}, control_token=TOKEN, control_port=PORT, cors_origins=(), **kwargs)

    async def test_authorization_and_browser_paths(self):
        app = self.app()
        async with app.router.lifespan_context(app), httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url=ORIGIN) as client:
            token = json.loads((self.endpoints / f"{PORT}.json").read_text())["client_token"]
            path = "/__taskprogress/v1/checklists/missing/example"
            body = {"version": 1, "id": "test", "type": "load", "payload": {}}
            cases = [
                ([], 403),
                ([("authorization", "Bearer wrong")], 403),
                ([("authorization", f"Bearer {token}")], 404),
                ([("authorization", f"Bearer {token}"), ("origin", "http://evil.example")], 403),
                ([("authorization", f"Bearer {token}"), ("authorization", f"Bearer {token}")], 403),
                ([("origin", ORIGIN), ("x-taskprogress-editor", "1")], 404),
            ]
            for headers, expected in cases:
                with self.subTest(headers=headers):
                    self.assertEqual((await client.post(path, headers=headers, json=body)).status_code, expected)
            headers = {"authorization": f"Bearer {token}"}
            response = subprocess.CompletedProcess(args=[], returncode=0, stdout=b'{"type":"result","id":"test"}', stderr=b'')
            with patch('service.taskprogress_host.subprocess.run', return_value=response) as bridge:
                result = await client.post('/__taskprogress/v1/checklists/secure-test/example', headers=headers, json=body)
            self.assertEqual(result.json()['type'], 'result')
            self.assertEqual(bridge.call_count, 1)
            self.assertEqual((await client.post('/__taskprogress/v1/edit-sessions', headers=headers, json={})).status_code, 403)
            self.assertEqual((await client.post('/__localwebservice/v1/shutdown', headers=headers)).status_code, 401)
            health = (await client.get('/__taskprogress/v1/health')).json()
            self.assertEqual(health['service'], 'taskprogress-edit-host')
            self.assertNotIn(token, json.dumps(health))

    async def test_lifespan_replaces_only_owned_port_and_preserves_new_owner(self):
        self.endpoints.mkdir(parents=True)
        own = self.endpoints / f"{PORT}.json"
        other = self.endpoints / "8766.json"
        own.write_text('{"stale": true}')
        other.write_text('{"other": true}')
        app = self.app()
        async with app.router.lifespan_context(app):
            first = json.loads(own.read_text())
            self.assertEqual(set(first), {'service', 'api_version', 'host', 'port', 'base_url', 'api_prefix', 'pid', 'client_token', 'started_at'})
            self.assertEqual(first['base_url'], ORIGIN)
            self.assertEqual(first['service'], 'taskprogress')
            self.assertEqual(first['api_version'], 1)
            self.assertEqual(first['host'], '127.0.0.1')
            self.assertEqual(first['port'], PORT)
            self.assertEqual(first['api_prefix'], '/__taskprogress/v1')
            self.assertGreater(first['pid'], 0)
            self.assertTrue(first['client_token'])
            self.assertIsNotNone(datetime.fromisoformat(first['started_at']).tzinfo)
            self.assertNotIn(TOKEN, json.dumps(first))
            self.assertEqual(json.loads(other.read_text()), {'other': True})
            self.assertEqual(json.loads(own.read_text())['client_token'], first['client_token'])
        self.assertFalse(own.exists())
        app = self.app()
        async with app.router.lifespan_context(app):
            second = json.loads(own.read_text())
            self.assertNotEqual(first['client_token'], second['client_token'])
            own.write_text(json.dumps({'client_token': 'replacement'}))
        self.assertEqual(json.loads(own.read_text())['client_token'], 'replacement')
        self.assertTrue(other.exists())

    async def test_rejects_exposed_directory_and_exact_file(self):
        for directory, kwargs in [
            (self.web / 'private', {}),
            (self.root / 'mount' / 'private', {'mounts': {'/mount': self.root / 'mount'}}),
            (self.endpoints, {'files': {'/leak': self.endpoints / f'{PORT}.json'}}),
        ]:
            with self.subTest(directory=directory):
                factory = create_taskprogress_app_factory(self.local, report_schema=ROOT / 'schemas' / 'report.schema.json', endpoints_directory=directory)
                with self.assertRaises(ValueError):
                    factory(self.web, control_token=TOKEN, control_port=PORT, cors_origins=(), **kwargs)

    async def test_discovery_probe_rejects_foreign_health_without_using_pid(self):
        foreign = FastAPI()

        @foreign.get('/__taskprogress/v1/health')
        async def foreign_health():
            return {'service': 'another-service', 'pid': 1234}

        async def is_taskprogress(client, endpoint):
            try:
                response = await client.get(endpoint['base_url'] + '/__taskprogress/v1/health')
                return response.is_success and response.json().get('service') == 'taskprogress-edit-host'
            except (httpx.HTTPError, ValueError):
                return False

        listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        listener.bind(('127.0.0.1', 0))
        listener.listen()
        port = listener.getsockname()[1]
        self.endpoints.mkdir(parents=True)
        orphan = self.endpoints / f'{port}.json'
        orphan.write_text(json.dumps({'base_url': f'http://127.0.0.1:{port}', 'pid': 1234}))
        candidate = json.loads(orphan.read_text())
        server = uvicorn.Server(uvicorn.Config(foreign, log_level='error', lifespan='off'))
        server_task = asyncio.create_task(server.serve(sockets=[listener]))
        try:
            for _ in range(100):
                if server.started:
                    break
                await asyncio.sleep(0.01)
            self.assertTrue(server.started)
            async with httpx.AsyncClient(trust_env=False) as client:
                self.assertFalse(await is_taskprogress(client, candidate))
        finally:
            server.should_exit = True
            await server_task
        app = self.app()
        async with app.router.lifespan_context(app), httpx.AsyncClient(transport=httpx.ASGITransport(app=app)) as client:
            self.assertTrue(await is_taskprogress(client, {'base_url': ORIGIN, 'pid': -1}))


if __name__ == '__main__':
    unittest.main()
