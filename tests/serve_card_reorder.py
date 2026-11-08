"""Foreground source-order acceptance host; temporary data, no production registration."""
import importlib.util
import json
import tempfile
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('card_reorder_pilot', ROOT / 'scripts/web_ui_pilot.py')
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


def fixture():
    def card(key, priority=2):
        return dict(id=key, title=key, summary='Source order acceptance', status='planned', priority=priority,
                    completed_items=[], pending_items=[dict(id='work', title='Work', priority=2)])
    return dict(schema_version='1.0', scope_id='web-ui-pilot-test', report_id='card-reorder',
                title='Card reorder acceptance', updated_at='2026-11-08T00:00:00Z',
                tasks=[card('urgent', 0), card('a'), card('hidden'), card('b'), card('next'), card('low', 3)],
                next=dict(task_id='next', item_id='work'))


if __name__ == '__main__':
    with tempfile.TemporaryDirectory(prefix='taskprogress-card-order-') as temporary:
        data = Path(temporary) / 'data'
        pilot.data_directories(data)
        report = data / 'web-ui-pilot-test/report.json'
        report.write_text(json.dumps(fixture(), ensure_ascii=False), encoding='utf-8')
        print('Disposable card ordering: http://127.0.0.1:8021/?scope=web-ui-pilot-test&dev=none', flush=True)
        print('Only temporary data is writable. Ctrl+C stops and removes it; production 8001 is untouched.', flush=True)
        uvicorn.run(pilot.create_app(8021, data_root=data, candidate=True), host='127.0.0.1', port=8021, access_log=False)
