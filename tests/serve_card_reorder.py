"""Foreground source-order acceptance host; temporary data, no production registration."""
import argparse
import copy
import importlib.util
import json
import tempfile
from pathlib import Path

import uvicorn

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('card_reorder_pilot', ROOT / 'scripts/web_ui_pilot.py')
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


def fixture(next_marker=False, card_ui=False, completion=False, terminal_stack=False):
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
    if completion:
        next(task for task in report['tasks'] if task['id'] == 'a')['pending_items'] = []
        for key in ['urgent', 'b']:
            task = next(task for task in report['tasks'] if task['id'] == key)
            task['status'] = 'done'
            task['priority'] = 3 if key == 'urgent' else 0
            task['completed_items'] = [dict(id='older', title='Source first', status='done', priority=3),
                                       dict(id='newer', title='Source second', status='done', priority=0)]
            task['pending_items'] = []
        bound = card('bound')
        bound['pending_items'] = [dict(id='check', title='Bound completion', document_ref=dict(
            kind='checklist', scope_id='web-ui-pilot-test', task='completion-observer'))]
        report['tasks'].append(bound)
        report['schema_version'] = '1.1'
        report['tasks'].append(dict(id='pointer-finished', kind='report_pointer', title='Completed target',
                                    report_ref=dict(scope_id='example')))
    if terminal_stack:
        low = next(task for task in report['tasks'] if task['id'] == 'low')
        low['pending_items'][0]['priority'] = 3
        for key, status, second in [('replaced', 'obsolete', 2), ('dropped', 'discontinued', 3)]:
            row = next(row for row in low['pending_items'] if row['id'] == key)
            row['priority'] = 0
            row['activity'] = [dict(event='updated', actor='codex', at=f'2026-11-08T00:00:0{second}Z', note='status:' + status)]
        low['completed_items'] = [dict(id='done-new', title='Newest done', status='done', priority=3,
            activity=[dict(event='done', actor='codex', at='2026-11-08T00:00:04Z')]),
            dict(id='done-old', title='Old done', status='done', priority=0,
            activity=[dict(event='done', actor='codex', at='2026-11-08T00:00:01Z')])]
        for scheme in ['light', 'dark']:
            stack = copy.deepcopy(low)
            stack['id'] = 'stack-' + scheme
            stack['title'] = 'Terminal stack ' + scheme
            report['tasks'].append(stack)
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--next-marker', action='store_true', help='Use long, repeated child IDs for Next regression')
    parser.add_argument('--card-ui', action='store_true', help='Include retired states for card UI regression')
    parser.add_argument('--completion', action='store_true', help='Include completed cards and child ordering')
    parser.add_argument('--terminal-stack', action='store_true', help='Include dated mixed terminal child rows (requires --card-ui)')
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix='taskprogress-card-order-') as temporary:
        data = Path(temporary) / 'data'
        pilot.data_directories(data)
        report = data / 'web-ui-pilot-test/report.json'
        report.write_text(json.dumps(fixture(args.next_marker, args.card_ui, args.completion, args.terminal_stack), ensure_ascii=False), encoding='utf-8')
        if args.card_ui:
            document = data / 'web-ui-pilot-test/Documentation/Retirement.md'
            document.parent.mkdir(exist_ok=True)
            document.write_text('# Replacement\nDisposable replacement evidence.\n', encoding='utf-8')
        if args.completion:
            (data / 'example/report.json').write_text(json.dumps(dict(
                schema_version='1.0', scope_id='example', report_id='completed-target', title='Completed target',
                updated_at='2026-11-08T00:00:00Z', tasks=[dict(id='finished', title='Finished', summary='Finished',
                status='done', completed_items=[], pending_items=[])])), encoding='utf-8')
            checklist = data / 'web-ui-pilot-test/checklists/completion-observer.checklist'
            checklist.parent.mkdir(exist_ok=True)
            checklist.write_text('# Completion observer Checklist\n\nCurrent round: `spec.md#completion`.\n\n'
                                 '- [x] **1. Complete fixture**\n  Outcome: Fixture is complete.\n  Checks:\n'
                                 '    - [x] **Complete**\n      - Action: Read the disposable fixture.\n'
                                 '      - Expect: The fixture is complete.\n', encoding='utf-8')
        print('Disposable card ordering: http://127.0.0.1:8021/?scope=web-ui-pilot-test&dev=none', flush=True)
        print('Only temporary data is writable. Ctrl+C stops and removes it; production 8001 is untouched.', flush=True)
        uvicorn.run(pilot.create_app(8021, data_root=data, candidate=True), host='127.0.0.1', port=8021, access_log=False)
