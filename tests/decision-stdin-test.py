"""Verify the real decisions CLI's UTF-8 stdin boundary using an isolated executable."""

import json
from pathlib import Path
import subprocess
import sys
import tempfile


def main():
    executable = Path(sys.argv[1]).resolve(strict=True)
    fixture = Path(__file__).parent / "fixtures" / "decision-example.decisions"
    fixture_bytes = fixture.read_bytes()
    with tempfile.TemporaryDirectory(prefix="taskprogress-decisions-stdin-") as folder:
        path = Path(folder) / fixture.name

        def request(body, prefix=b"", task=None):
            args = [str(executable), "decisions", "request", "--file", str(path)]
            if task is not None:
                args.extend(["--task", task])
            result = subprocess.run(args, input=prefix + body, capture_output=True, timeout=20)
            assert result.returncode == 0, result.stderr.decode("utf-8-sig")
            return json.loads(result.stdout.decode("utf-8-sig"))

        def encode(value):
            return json.dumps(value, ensure_ascii=False).encode("utf-8")

        for label, prefix in [("plain", b""), ("bom", b"\xef\xbb\xbf")]:
            path.write_bytes(fixture_bytes)
            loaded = request(encode({"operation": "load", "request_id": "中文讀取"}), prefix)
            assert loaded["ok"], loaded
            assert loaded["request_id"] == "中文讀取"
            assert loaded["document"]["decisions"][0]["question"] == "CLI 使用哪種輸入？"
            assert path.read_bytes() == fixture_bytes, "load changed decision bytes"
            invalid = request(b'{"operation":', prefix)
            assert not invalid["ok"], "invalid JSON accepted"
            assert path.read_bytes() == fixture_bytes, "invalid request changed decision bytes"
            confirmed = request(encode({
                "operation": "confirm", "decision_id": "input", "request_id": "中文確認",
                "expected_revision": loaded["revision"], "expected_version": 1,
                "payload": {"kind": "other", "text": "需要保留中文字與理由"},
            }), prefix, task="decision-example")
            assert confirmed["ok"], confirmed
            answer = confirmed["document"]["decisions"][0]["answer"]
            assert answer["text"] == "需要保留中文字與理由"
            saved = json.loads(path.read_bytes())
            assert saved["decisions"][0]["answer"] == answer
            print(f"{label}: load unchanged; invalid JSON rejected; Chinese request and answer preserved")

        assert not request(b'{\xef\xbb\xbf"operation":"load"}')["ok"], "embedded BOM accepted"
    assert fixture.read_bytes() == fixture_bytes, "source fixture changed"
    print("Real decisions stdin checks passed; source fixture unchanged; no service launched.")


if __name__ == "__main__":
    main()
