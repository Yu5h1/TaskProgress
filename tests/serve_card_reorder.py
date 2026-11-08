"""Foreground source-order acceptance host; temporary data, no production registration."""
import argparse
import importlib.util
import json
import tempfile
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('card_reorder_pilot', ROOT / 'scripts/web_ui_pilot.py')
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


def fixture(next_marker=False, card_ui=False):
    def card(key, priority=2, child_priority=2, status='planned'):
        items = [dict(id='work', title='Work', priority=child_priority)]
        if next_marker:
            items[0]['title'] = 'Work: ' + 'Long text for Next expansion coverage. ' * 7
            items.insert(0, dict(id='first', title='First', priority=0))
        return dict(id=key, title=key, summary='Source order acceptance', status=status, priority=priority,
                    completed_items=[], pending_items=items)
    report = dict(schema_version='1.0', scope_id='web-ui-pilot-test', report_id='card-reorder',
                title='Card reorder acceptance', updated_at='2026-11-08T00:00:00Z',
                tasks=[card('urgent', 0), card('a', child_priority=0, status='in_progress'), card('hidden', child_priority=1), card('b', child_priority=3, status='in_progress'), card('next'), card('low', 3)],
                next=dict(task_id='next', item_id='work'))
    if card_ui:
        report['tasks'][-1]['pending_items'].extend([
            dict(id='replaced', title='Replaced item', status='obsolete',
                 retirement=dict(replaced_by=dict(scope_id='web-ui-pilot-test', task_id='low', item_id='work'))),
            dict(id='dropped', title='Dropped item', status='discontinued', retirement=dict(reason='No longer needed'))])
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--next-marker', action='store_true', help='Use long, repeated child IDs for Next regression')
    parser.add_argument('--card-ui', action='store_true', help='Include retired states for card UI regression')
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix='taskprogress-card-order-') as temporary:
        data = Path(temporary) / 'data'
        pilot.data_directories(data)
        report = data / 'web-ui-pilot-test/report.json'
        report.write_text(json.dumps(fixture(args.next_marker, args.card_ui), ensure_ascii=False), encoding='utf-8')
        print('Disposable card ordering: http://127.0.0.1:8021/?scope=web-ui-pilot-test&dev=none', flush=True)
        print('Only temporary data is writable. Ctrl+C stops and removes it; production 8001 is untouched.', flush=True)
        uvicorn.run(pilot.create_app(8021, data_root=data, candidate=True), host='127.0.0.1', port=8021, access_log=False)
