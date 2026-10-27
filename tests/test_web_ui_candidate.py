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


if __name__ == '__main__':
    unittest.main()
