"""Candidate host uses existing persistence with temporary fixture copies only."""
import hashlib
import json
import unittest
from unittest.mock import patch
import test_web_ui_pilot as base

pilot = base.pilot


class CandidateTests(base.PilotTests):
    def test_delivery_drift_and_runtime_independence(self):
        site = pilot.candidate_site()
        self.assertEqual(200, self.client.get('/demo/taskprogress/?scope=task-progress').status_code)
        with patch.object(pilot, 'collect', side_effect=AssertionError('candidate imported Web')):
            self.assertIsNotNone(pilot.create_app(data_root=self.data))
        bad = self.data.parent / 'bad-candidate'
        pointer = (pilot.BUILD / 'candidate.json').read_bytes()
        identity = json.loads(pointer)['identity']
        target = bad / 'candidates' / identity
        (target / 'site').mkdir(parents=True)
        (target / 'manifest.json').write_bytes((site.parent / 'manifest.json').read_bytes())
        (bad / 'candidate.json').write_bytes(pointer)
        with patch.object(pilot, 'BUILD', bad), self.assertRaisesRegex(ValueError, 'Candidate asset drift'):
            pilot.candidate_site()

    def setUp(self):
        self.fingerprint = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in (pilot.ROOT / 'viewer').rglob('*') if p.is_file()}
        original = pilot.create_app
        self.candidate = patch.object(pilot, 'create_app', side_effect=lambda *args, **kwargs: original(*args, **{**kwargs, 'candidate': True}))
        self.candidate.start()
        super().setUp()

    def tearDown(self):
        try:
            super().tearDown()
            for path, expected in self.fingerprint.items():
                self.assertEqual(expected, hashlib.sha256(path.read_bytes()).hexdigest(), str(path))
        finally:
            self.candidate.stop()

    def test_candidate_delivery_and_no_implicit_scope(self):
        html = self.client.get('/demo/taskprogress/').text
        self.assertIn('theme-start.js', html)
        self.assertNotIn('demo-theme', html)
        script = self.client.get('/demo/taskprogress/demo.js').text
        self.assertNotIn('web.demo.theme.v1', script)
        self.assertNotIn('fixture.json', script)
        self.assertIn('taskprogressThemeBoot', script, 'candidate must take over its first-paint theme controller')
        self.assertTrue('task-progress.theme.v1' in self.client.get('/demo/taskprogress/assets/theme-model.js').text)
        self.assertEqual(200, self.client.get('/__taskprogress/v1/capabilities/web-ui-pilot-test').status_code)

    def test_entry_routes_security_and_preserved_restart(self):
        # New candidates contain only the current renderer. Historical Svelte
        # comparisons stay in the archived baseline, outside the new delivery.
        for path in ['/?scope=task-progress', '/checklist/?scope=task-progress&task=card-disclosure',
                     '/decisions/?scope=task-progress&task=decision-example', '/index.html']:
            self.assertEqual(200, self.client.get(path).status_code, path)
        for path in ['/demo/taskprogress/reference/', '/data/task-progress/report.json',
                     '/demo/taskprogress/source/report.json', '/__taskprogress/v1/capabilities/yu5h1lib-web']:
            self.assertEqual(404, self.client.get(path).status_code, path)
        self.assertEqual(403, self.client.post('/__taskprogress/v1/edit-sessions',
            headers={**base.HEADERS, 'Origin': 'https://example.invalid'}, json={'scope_id': 'task-progress'}).status_code)
        report = self.data / 'task-progress/report.json'
        document = json.loads(report.read_text(encoding='utf-8'))
        document['summary'] = 'preserve me'
        report.write_text(json.dumps(document), encoding='utf-8')
        pilot.data_directories(self.data)
        self.assertEqual('preserve me', json.loads(report.read_text(encoding='utf-8'))['summary'])


if __name__ == '__main__':
    unittest.main()
