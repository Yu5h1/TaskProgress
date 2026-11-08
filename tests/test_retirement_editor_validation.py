import copy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from service.report_operations import ReportError, validate_retirement_changes


class RetirementEditorValidationTests(unittest.TestCase):
    def setUp(self):
        self.report = {'scope_id': 'test', 'tasks': [{'id': 'card', 'pending_items': [
            {'id': 'work', 'title': 'Work'}, {'id': 'target', 'title': 'Target'}]}]}
        self.registry = patch('service.report_operations.scope_registry', return_value={})
        self.registry.start()
        self.addCleanup(self.registry.stop)

    def retire(self, status, metadata):
        after = copy.deepcopy(self.report)
        after['tasks'][0]['pending_items'][0].update(status=status, retirement=metadata)
        return after

    def test_same_scope_item_and_drop_reason_are_valid(self):
        for status, metadata in [('obsolete', {'replaced_by': {'scope_id': 'test', 'task_id': 'card', 'item_id': 'target'}}),
                                 ('discontinued', {'reason': 'No longer needed'})]:
            validate_retirement_changes(self.report, self.retire(status, metadata))

    def test_self_missing_and_retired_replacements_are_rejected(self):
        for target in ['work', 'missing', 'target']:
            after = self.retire('obsolete', {'replaced_by': {'scope_id': 'test', 'task_id': 'card', 'item_id': target}})
            if target == 'target':
                after['tasks'][0]['pending_items'][1].update(status='discontinued', retirement={'reason': 'Gone'})
            with self.assertRaises(ReportError):
                validate_retirement_changes(self.report, after)

    def test_waiters_prevent_retirement(self):
        after = self.retire('discontinued', {'reason': 'Gone'})
        after['tasks'][0]['pending_items'][1]['waits_for'] = [{'scope_id': 'test', 'task_id': 'card', 'item_id': 'work'}]
        with self.assertRaises(ReportError):
            validate_retirement_changes(self.report, after)

    def test_document_must_exist_inside_scope_on_windows_and_posix(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / 'Plan.md').write_text('# Replacement', encoding='utf-8')
            validate_retirement_changes(self.report, self.retire('obsolete', {'replaced_by': {'document': 'Plan.md#replacement'}}), root)
            for document in ['../outside.md', 'missing.md', 'C:/outside.md', '\\outside.md', '#only-anchor']:
                with self.assertRaises(ReportError, msg=document):
                    validate_retirement_changes(self.report, self.retire('obsolete', {'replaced_by': {'document': document}}), root)

    def test_metadata_only_changes_are_checked_and_unmodified_retirement_is_preserved(self):
        before = self.retire('obsolete', {'replaced_by': {'scope_id': 'test', 'task_id': 'card', 'item_id': 'target'}, 'reason': 'Context'})
        validate_retirement_changes(before, copy.deepcopy(before))
        after = copy.deepcopy(before)
        after['tasks'][0]['pending_items'][0]['retirement']['replaced_by']['item_id'] = 'missing'
        with self.assertRaises(ReportError):
            validate_retirement_changes(before, after)


if __name__ == '__main__':
    unittest.main()
