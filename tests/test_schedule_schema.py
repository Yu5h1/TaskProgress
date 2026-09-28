"""Schedule draft contracts: strict variants, dates, references and projection shape."""
import copy
from datetime import datetime
import json
from pathlib import Path
import unittest
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[1]
FORMATS = FormatChecker()


@FORMATS.checks('date-time', raises=(ValueError, TypeError))
def valid_timestamp(value):
    if not isinstance(value, str):
        return True
    return datetime.fromisoformat(value.replace('Z', '+00:00')).tzinfo is not None


class ScheduleSchemaTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        schemas = [json.loads((ROOT / 'schemas' / name).read_text(encoding='utf-8')) for name in
                   ['module-envelope.schema.json', 'schedule.plan.schema.json', 'schedule.analysis.schema.json']]
        registry = Registry().with_resources((s['$id'], Resource.from_contents(s)) for s in schemas)
        cls.validators = []
        for schema in schemas[1:]:
            Draft202012Validator.check_schema(schema)
            cls.validators.append(Draft202012Validator(schema, registry=registry, format_checker=FORMATS))
        cls.plan = json.loads((ROOT / 'tests/fixtures/schedule/parallel.plan.json').read_text(encoding='utf-8'))

    def test_all_input_fixtures(self):
        for path in (ROOT / 'tests/fixtures/schedule').glob('*.plan.json'):
            with self.subTest(path=path.name):
                self.validators[0].validate(json.loads(path.read_text(encoding='utf-8')))

    def test_invalid_input_variants(self):
        changes = [
            lambda p: p.update(unknown=True),
            lambda p: p.update(planning_started_at='2026-09-28T09:00:00'),
            lambda p: p.update(planning_started_at='2026-02-30T09:00:00Z'),
            lambda p: p['works'][0]['assignments'][0].update(allocation_percent=101),
            lambda p: p['works'][0]['duration_source'].update(resource_id='unexpected'),
            lambda p: p['works'][1]['dependencies'][0].update(lag_minutes=-1),
            lambda p: p['works'][0]['subject'].update(item_id='illegal-on-task'),
        ]
        for change in changes:
            plan = copy.deepcopy(self.plan)
            change(plan)
            self.assertFalse(self.validators[0].is_valid(plan))

    def test_projection_envelope_and_partial_dates(self):
        revision = 'sha256:' + 'a' * 64
        projection = dict(module_type='taskprogress.schedule', schema_version='0.1', module_id='sample',
                          report_id='sample', scope_id='sample', generated_at='2026-09-28T09:00:00+08:00',
                          generator=dict(id='schedule', version='0.1'), report_revision=revision,
                          source_revision=revision, content_revision=revision, input_modules=[],
                          data=dict(input_lineage=dict(schedule_plan_revision=revision),
                                    summary=dict(scheduled_work_count=0, unscheduled_work_count=1, conflict_count=0),
                                    works=[dict(work_id='a', subject=dict(kind='task', task_id='a'),
                                                state='unscheduled', resource_ids=[])], milestones=[],
                                    diagnostics=[dict(code='missing_duration', work_id='a')]))
        validator = self.validators[1]
        validator.validate(projection)
        invalid = copy.deepcopy(projection)
        invalid['data']['works'][0]['scheduled_start_at'] = projection['generated_at']
        self.assertFalse(validator.is_valid(invalid))
        invalid = copy.deepcopy(projection)
        invalid['data']['works'][0]['state'] = 'scheduled'
        self.assertFalse(validator.is_valid(invalid))
        invalid = copy.deepcopy(projection)
        invalid['content_revision'] = 'bad'
        self.assertFalse(validator.is_valid(invalid))
        invalid = copy.deepcopy(projection)
        invalid['private_calendar'] = []
        self.assertFalse(validator.is_valid(invalid))


if __name__ == '__main__':
    unittest.main()
