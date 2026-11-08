import copy
import unittest
from service.report_operations import apply_operations, append_activity


class ItemTerminalActivityTests(unittest.TestCase):
    def setUp(self):
        self.report = {'schema_version': '1.0', 'scope_id': 'test', 'report_id': 'test', 'title': 'Test',
                       'updated_at': '2026-11-09T00:00:00Z', 'tasks': [dict(id='card', title='Card', summary='Test', status='planned',
                       pending_items=[dict(id=key, title=key) for key in ['a', 'b', 'target']], completed_items=[])]}
        self.at = '2026-11-09T00:00:00.000Z'

    def apply(self, report, operations):
        return apply_operations(report, None, operations, actor={'actor': 'codex'}, at=self.at)[0]

    def test_mixed_terminal_batch_records_order_without_relocating_retired_rows(self):
        ops = [dict(op='item.update', task_id='card', item_id='a', set=dict(status='done')),
               dict(op='item.update', task_id='card', item_id='b', set=dict(status='discontinued', retirement=dict(reason='Dropped')))]
        result = self.apply(self.report, ops)
        task = result['tasks'][0]
        done, dropped = task['completed_items'][0], task['pending_items'][0]
        self.assertEqual(dropped['id'], 'b')
        self.assertEqual(dropped['activity'][-1]['note'], 'status:discontinued')
        self.assertGreater(dropped['activity'][-1]['at'], done['activity'][-1]['at'])

    def test_metadata_updates_keep_terminal_marker_through_pruning_and_reopening_restamps(self):
        result = self.apply(self.report, [dict(op='item.update', task_id='card', item_id='a',
            set=dict(status='obsolete', retirement=dict(replaced_by=dict(scope_id='test', task_id='card', item_id='target'))))])
        row = result['tasks'][0]['pending_items'][0]
        marker = copy.deepcopy(row['activity'][-1])
        for i in range(8):
            result = self.apply(result, [dict(op='item.update', task_id='card', item_id='a', set=dict(title=f'Renamed {i}'))])
        row = result['tasks'][0]['pending_items'][0]
        self.assertIn(marker, row['activity'])
        result = self.apply(result, [dict(op='item.update', task_id='card', item_id='a', set=dict(status='planned'), unset=['retirement']),
            dict(op='item.update', task_id='card', item_id='a', set=dict(status='discontinued', retirement=dict(reason='Dropped')))])
        self.assertGreater(result['tasks'][0]['pending_items'][0]['activity'][-1]['at'], marker['at'])

    def test_new_terminal_items_in_one_batch_also_have_order_and_created_history(self):
        result = self.apply(self.report, [dict(op='item.add', task_id='card', value=dict(id='new-done', title='Done', status='done')),
            dict(op='item.add', task_id='card', value=dict(id='new-drop', title='Drop', status='discontinued', retirement=dict(reason='Dropped')))])
        task = result['tasks'][0]
        done, dropped = task['completed_items'][0], task['pending_items'][-1]
        self.assertEqual([e['event'] for e in dropped['activity']], ['created', 'updated'])
        self.assertGreater(dropped['activity'][-1]['at'], done['activity'][-1]['at'])
        for i in range(8):
            append_activity(done, dict(event='updated', actor='codex', at=f'2026-11-09T00:00:0{i}Z'))
        self.assertTrue(any(e['event'] == 'done' for e in done['activity']))

    def test_implicit_completed_status_is_stamped_on_add_but_not_on_repeat_done(self):
        result = self.apply(self.report, [dict(op='task.add', value=dict(id='implicit', title='Implicit', summary='Test', status='done',
            pending_items=[], completed_items=[dict(id='child', title='Child')]))])
        row = result['tasks'][0]['completed_items'][0]
        self.assertEqual([e['event'] for e in row['activity']], ['created', 'done'])
        marker = copy.deepcopy(row['activity'][-1])
        result = self.apply(result, [dict(op='item.update', task_id='implicit', item_id='child', set=dict(status='done'))])
        row = result['tasks'][0]['completed_items'][0]
        self.assertEqual(row['activity'][-1]['event'], 'updated')
        self.assertEqual(next(e for e in row['activity'] if e['event'] == 'done'), marker)
