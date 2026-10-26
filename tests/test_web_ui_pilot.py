"""Changed-scope checks against the original API/CLI and disposable data."""
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("web_ui_pilot", ROOT / "scripts/web_ui_pilot.py")
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
HEADERS = {"Origin": "http://127.0.0.1:8017", "X-TaskProgress-Editor": "1"}


class PilotTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="taskprogress-pilot-")
        self.data = Path(self.temp.name) / "data"
        self.source = {p: p.read_bytes() for p in [ROOT / "report.json", *pilot.FIXTURE.rglob("*"), ROOT / "viewer/assets/viewer-ui.js"] if p.is_file()}
        self.client = TestClient(pilot.create_app(data_root=self.data), base_url="http://127.0.0.1:8017")

    def tearDown(self):
        self.client.close()
        for path, data in self.source.items():
            self.assertEqual(data, path.read_bytes(), f"source changed: {path}")
        self.temp.cleanup()

    def test_delivery_drift_and_runtime_independence(self):
        site = pilot.verify_site()
        self.assertEqual(200, self.client.get('/demo/taskprogress/?scope=task-progress').status_code)
        with patch.object(pilot, "collect", side_effect=AssertionError("runtime imported Web")):
            self.assertIsNotNone(pilot.create_app(data_root=self.data))
        lock = json.loads(pilot.LOCK.read_text(encoding='utf-8'))
        bad = Path(self.temp.name) / "delivery"
        (bad / 'site').mkdir(parents=True)
        (bad / 'manifest.json').write_bytes((site.parent / 'manifest.json').read_bytes())
        with self.assertRaisesRegex(ValueError, "asset drift"):
            pilot.verify_site(bad, lock)

    def test_entry_routes_security_and_preserved_restart(self):
        for path in ['/?scope=task-progress','/checklist/?scope=task-progress&task=card-disclosure','/decisions/?scope=task-progress&task=decision-example','/index.html','/demo/taskprogress/reference/?scope=task-progress']:
            self.assertEqual(200, self.client.get(path).status_code, path)
        for path in ['/data/task-progress/report.json','/demo/taskprogress/source/report.json','/__taskprogress/v1/capabilities/yu5h1lib-web']:
            self.assertEqual(404, self.client.get(path).status_code, path)
        self.assertEqual(403, self.client.post('/__taskprogress/v1/edit-sessions', headers={**HEADERS,'Origin':'https://example.invalid'},json={'scope_id':'task-progress'}).status_code)
        report = self.data / 'task-progress/report.json'
        document = json.loads(report.read_text(encoding='utf-8'));document['summary']='preserve me';report.write_text(json.dumps(document),encoding='utf-8')
        pilot.data_directories(self.data)
        self.assertEqual('preserve me',json.loads(report.read_text(encoding='utf-8'))['summary'])

    def test_real_report_writer_and_stale_revision(self):
        scope='web-ui-pilot-test'
        session=self.client.post('/__taskprogress/v1/edit-sessions',headers=HEADERS,json={'scope_id':scope,'timezone':'Asia/Taipei'})
        self.assertEqual(201,session.status_code,session.text);s=session.json()
        report=json.loads((self.data/scope/'report.json').read_text(encoding='utf-8'));report['summary']='real pilot save'
        headers={**HEADERS,'Authorization':'Bearer '+s['token'],'If-Match':'"'+s['revision']+'"'}
        payload={'report':report,'inputs_revision':s['inputs_revision'],'local_revision':s['local_revision'],'inputs':{},'changes':[]}
        result=self.client.put('/__taskprogress/v1/edit-sessions/'+scope,headers=headers,json=payload)
        self.assertEqual(200,result.status_code,result.text)
        self.assertEqual('real pilot save',json.loads((self.data/scope/'report.json').read_text(encoding='utf-8'))['summary'])
        headers['Authorization']='Bearer '+result.json()['token']
        self.assertEqual(409,self.client.put('/__taskprogress/v1/edit-sessions/'+scope,headers=headers,json=payload).status_code)

    def test_real_document_writers(self):
        path='/__taskprogress/v1/checklists/web-ui-pilot-test/pilot'
        def check(kind,payload=None):
            request={'version':1,'id':'pilot-test','type':kind}
            if payload is not None:request['payload']=payload
            response=self.client.post(path,headers=HEADERS,json=request)
            self.assertEqual(200,response.status_code,response.text)
            return response.json()
        document=check('load')['payload']
        payload={'revision':document['revision'],'results':[{'workItemId':1,'checkIndex':0,'status':'passed','observed':None}]}
        result=check('save',payload);self.assertEqual('result',result['type'],result)
        self.assertEqual('passed',check('load')['payload']['items'][0]['checks'][0]['status'])
        self.assertEqual('revision_conflict',check('save',payload)['error']['code'])
        path='/__taskprogress/v1/decisions/web-ui-pilot-test/pilot'
        def decision(request):
            response=self.client.post(path,headers=HEADERS,json=request)
            self.assertEqual(200,response.status_code,response.text);return response.json()
        document=decision({'operation':'load'})
        request={'operation':'confirm','decision_id':'choice','expected_revision':document['revision'],'expected_version':1,'request_id':'pilot-operation','payload':{'kind':'option','option_id':'first'}}
        result=decision(request);self.assertTrue(result['ok'],result)
        self.assertEqual('first',decision({'operation':'load'})['document']['decisions'][0]['answer']['option_id'])
        self.assertEqual('already_applied',decision(request)['status'])


if __name__ == '__main__':
    unittest.main()
