"""Decision route isolation plus visible, temporary-file CLI process probes."""
import concurrent.futures
import copy
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from jsonschema import Draft202012Validator, FormatChecker
import test_taskprogress_host as host_tests

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / 'src/TaskProgress.Cli/bin/Debug/net9.0-windows/task-progress.exe'
FIXTURE = json.loads((ROOT / 'tests/fixtures/decision-example.decisions').read_text(encoding='utf-8'))

class DecisionRouteTests(unittest.TestCase):
    setUp = host_tests.ChecklistRequestRouteTests.setUp
    tearDown = host_tests.ChecklistRequestRouteTests.tearDown
    request_headers = host_tests.ChecklistRequestRouteTests.request_headers

    def call(self, suffix='', body=None, headers=None):
        return self.client.post('/__taskprogress/v1/decisions/secure-test' + suffix,
            headers=self.request_headers() if headers is None else headers, json=body or {'operation':'load'})

    def fake(self, **kwargs):
        document = copy.deepcopy(FIXTURE)
        document['task_id'] = 'first-task'
        return subprocess.CompletedProcess([], 0, json.dumps({'ok':True,'document':document,'revision':'a'}).encode(), b'')

    def test_route_is_same_origin_only_and_revise_is_not_browser_operation(self):
        with patch('service.taskprogress_host.subprocess.run') as run:
            self.assertEqual(403, self.call('/first-task', headers={'origin':'https://evil.example'}).status_code)
            self.assertEqual(403, self.call('/first-task', headers={'origin':host_tests.ORIGIN}).status_code)
            self.assertEqual(422, self.call('/first-task', {'operation':'revise'}).status_code)
            self.assertEqual(422, self.call('/unknown').status_code)
            run.assert_not_called()

    def test_load_resolves_exact_file_and_summary_isolates_bad_file(self):
        folder = self.root / 'decisions'; folder.mkdir()
        (folder / 'first-task.decisions').write_text('{}')
        (folder / 'bad.decisions').write_text('{}')
        def run(command, **kwargs):
            if command[-3].endswith('bad.decisions'):
                return subprocess.CompletedProcess(command, 0, b'{"ok":false,"error":{"code":"invalid_document"}}', b'')
            self.assertEqual(folder / 'first-task.decisions', Path(command[-3]))
            self.assertEqual(['--task','first-task'],command[-2:])
            return self.fake()
        with patch('service.taskprogress_host.subprocess.run', side_effect=run):
            self.assertTrue(self.call('/first-task').json()['ok'])
            result = self.call().json()
            self.assertTrue(result['incomplete'])
            self.assertEqual(2, result['pending'])
            self.assertEqual(2, len(result['files']))

    def test_task_identity_mismatch_is_rejected_before_write(self):
        wrong = self.fake()
        wrong.stdout = wrong.stdout.replace(b'first-task', b'other-task')
        with patch('service.taskprogress_host.subprocess.run', return_value=wrong) as run:
            self.assertEqual(422, self.call('/first-task', {'operation':'confirm'}).status_code)
            self.assertEqual(1, run.call_count)

    def test_clear_all_uses_same_guarded_document_route(self):
        body = {'operation':'clear_all','request_id':'clear','expected_revision':'a','payload':{}}
        with patch('service.taskprogress_host.subprocess.run', return_value=self.fake()) as run:
            self.assertTrue(self.call('/first-task', body).json()['ok'])
            self.assertEqual(2, run.call_count)
            self.assertEqual(body, json.loads(run.call_args.kwargs['input']))
            self.assertEqual(403, self.call('/first-task', body, headers={'origin':'https://evil.example'}).status_code)

    def test_linked_decisions_directory_is_rejected(self):
        resolve = Path.resolve
        def resolve_link(path, *args, **kwargs):
            if path.name == 'decisions': return self.root / 'outside'
            return resolve(path, *args, **kwargs)
        with patch.object(Path, 'resolve', resolve_link), patch('service.taskprogress_host.subprocess.run') as run:
            self.assertEqual(422, self.call('/first-task').status_code)
            run.assert_not_called()

class DecisionProcessTests(unittest.TestCase):
    def test_schema_fixture_and_two_real_processes_compete(self):
        schema = json.loads((ROOT / 'schemas/decisions.schema.json').read_text())
        validator = Draft202012Validator(schema, format_checker=FormatChecker())
        validator.validate(FIXTURE)
        with tempfile.TemporaryDirectory(prefix='tp-decisions-') as folder:
            file = Path(folder) / '中文 空白.decisions'
            file.write_text(json.dumps(FIXTURE,ensure_ascii=False),encoding='utf-8')
            def request(body):
                completed = subprocess.run([str(CLI),'decisions','request','--file',str(file)],
                    input=json.dumps(body,ensure_ascii=False).encode('utf-8'),capture_output=True,timeout=20,check=True)
                return json.loads(completed.stdout)
            initial = request({'operation':'load'})
            def confirm(request_id):
                return request({'operation':'confirm','request_id':request_id,'decision_id':'input',
                    'expected_revision':initial['revision'],'expected_version':1,
                    'payload':{'kind':'other','text':'真正的中文答案'}})
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(confirm,['process-a','process-b']))
            self.assertEqual(1,sum(result['ok'] for result in results))
            final = request({'operation':'load'})
            validator.validate(final['document'])
            self.assertEqual('真正的中文答案', final['document']['decisions'][0]['answer']['text'])
            self.assertNotIn('history', final['document']['decisions'][0])
            self.assertIn(final['document']['decisions'][0]['last_request']['request_id'], ['process-a','process-b'])

if __name__ == '__main__': unittest.main()
