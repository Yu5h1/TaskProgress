"""Explicit Windows process smoke test; run only when no-window execution is authorized.

Usage: python tests/verify_report_console.py --exe <task-progress.exe>
Uses disposable reports. The probe observes the real backend without changing its
launch flags, and records the Python console handle plus analyzer creation flags.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--exe', required=True)
    args = parser.parse_args()
    if os.name != 'nt':
        raise SystemExit('Windows only')
    exe = Path(args.exe).resolve()
    repository = Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix='taskprogress-console-') as temporary:
        root = Path(temporary)
        folder = root / 'report'
        folder.mkdir()
        observations = root / 'probe.jsonl'
        script = root / 'sitecustomize.py'
        script.write_text('''import ctypes, json, os, subprocess, sys
from pathlib import Path
def record(value):
    with open(os.environ['REPORT_CONSOLE_PROBE'], 'a', encoding='utf-8') as output:
        output.write(json.dumps(value) + '\\n')
ctypes.windll.kernel32.GetConsoleWindow.restype = ctypes.c_void_p
record({'event': 'backend', 'action': sys.argv[1],
        'console': ctypes.windll.kernel32.GetConsoleWindow() or 0})
original_popen = subprocess.Popen
class ObservedPopen(original_popen):
    def __init__(self, *args, **kwargs):
        record({'event': 'analyzer', 'flags': kwargs.get('creationflags', 0)})
        super().__init__(*args, **kwargs)
    def communicate(self, *args, **kwargs):
        result = super().communicate(*args, **kwargs)
        if self.returncode:
            record({'event': 'analyzer-error', 'stdout': result[0], 'stderr': result[1]})
        return result
subprocess.Popen = ObservedPopen
''', encoding='utf-8')
        environment = {**os.environ, 'TASK_PROGRESS_PYTHON': sys.executable,
                       'TASK_PROGRESS_VIEWER_ROOT': str(repository / 'viewer'),
                       'PYTHONPATH': str(root) + os.pathsep + os.environ.get('PYTHONPATH', ''),
                       'REPORT_CONSOLE_PROBE': str(observations),
                       }
        report = {'schema_version': '1.0', 'report_id': 'console-test',
                  'scope_id': 'console-test', 'title': 'Console test',
                  'updated_at': '2026-09-30T00:00:00Z', 'tasks': []}
        (folder / 'report.json').write_text(json.dumps(report), encoding='utf-8')

        def invoke(action, body=None, expected=0):
            command = [str(exe), 'report', action, str(folder)]
            if body is not None:
                command += ['--input', '-']
            result = subprocess.run(command, input=json.dumps(body) if body else '',
                                    capture_output=True, encoding='utf-8', timeout=40,
                                    env=environment, cwd=repository)
            assert result.returncode == expected, (action, result.returncode, result.stderr, result.stdout,
                                                   observations.read_text(encoding='utf-8'))
            data = json.loads(result.stdout)
            assert data['ok'] == (expected == 0), data
            print(f'{action}: exit {result.returncode}, valid JSON')
            return data

        for title, analysis in [('Saved by apply', False), ('Analyzed by apply', True)]:
            if analysis:
                config = json.loads((repository / 'experiments/time-reference/examples/time.config.json').read_text(encoding='utf-8'))
                config['scope_id'] = report['scope_id']
                (folder / 'time.config.json').write_text(json.dumps(config), encoding='utf-8')
            current = invoke('get')
            result = invoke('apply', {'version': '1', 'expected_revision': current['revision'],
                                     'operations': [{'op': 'report.update', 'set': {'title': title}}]})
            assert result['changed'], result
            assert json.loads((folder / 'report.json').read_text(encoding='utf-8'))['title'] == title
            if analysis:
                assert result['analysis'] == 'updated' and (folder / 'time.analysis.json').is_file(), result
            invoke('validate')
        (folder / 'report.json').write_text('{}', encoding='utf-8')
        invoke('validate', expected=2)
        events = [json.loads(line) for line in observations.read_text(encoding='utf-8').splitlines()]
        backend = [event for event in events if event['event'] == 'backend']
        analyzers = [event for event in events if event['event'] == 'analyzer']
        assert len(backend) == 7 and all(event['console'] == 0 for event in backend), events
        assert analyzers and all(event['flags'] & subprocess.CREATE_NO_WINDOW for event in analyzers), events
        print(f'PASS: {len(backend)} real Python invocations have no Console window; '
              f'{len(analyzers)} analyzer launch uses CREATE_NO_WINDOW. Temporary reports only.')


if __name__ == '__main__':
    main()
