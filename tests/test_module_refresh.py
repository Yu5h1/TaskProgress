"""Published projection schema and explicit CLI failure behavior on temporary copies."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / "src/TaskProgress.Cli/bin/Debug/net9.0-windows/task-progress.exe"

class ModuleRefreshProcessTests(unittest.TestCase):
    def test_schema_and_failed_generation_preserve_previous_projection(self):
        schema = json.loads((ROOT / "experiments/time-reference/schemas/time.analysis.schema.json").read_text(encoding="utf-8"))
        with tempfile.TemporaryDirectory(prefix="tp-module-refresh-") as directory:
            folder = Path(directory)
            (folder / "report.json").write_bytes((ROOT / "reports/example/report.json").read_bytes())
            def run():
                return subprocess.run([str(CLI), "analyze", str(folder), "--module", "time"], capture_output=True, timeout=30)
            success = run()
            self.assertEqual(0, success.returncode, success.stderr.decode(errors="replace"))
            projection = folder / "time.analysis.json"
            original = projection.read_bytes()
            data = json.loads(original)
            Draft202012Validator(schema, format_checker=FormatChecker()).validate(data)
            self.assertRegex(data["content_revision"], r"^sha256:[a-f0-9]{64}$")
            self.assertEqual([], data["input_modules"])
            (folder / "time.config.json").write_text("{invalid", encoding="utf-8")
            failure = run()
            self.assertNotEqual(0, failure.returncode)
            self.assertEqual(original, projection.read_bytes())
            self.assertFalse(list(folder.glob("*.staging.json")))

if __name__ == "__main__":
    unittest.main()
