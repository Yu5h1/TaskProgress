"""Bounded Windows sharing retries preserve the atomic transaction boundary."""
import os
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import patch

from service import report_store


class AtomicReplaceRetryTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.target = self.root / "report.json"
        self.target.write_bytes(b"original")

    def sharing_error(self):
        error = PermissionError("temporary Windows sharing conflict")
        error.winerror = 32
        return error

    def test_transient_conflict_reuses_flushed_file_then_succeeds(self):
        original = os.replace
        attempts = []

        def replace(source, target):
            attempts.append(source)
            self.assertEqual(Path(source).read_bytes(), b"changed")
            if len(attempts) < 3:
                raise self.sharing_error()
            return original(source, target)

        with patch.object(report_store.os, "replace", side_effect=replace), \
                patch.object(report_store.time, "sleep") as sleep:
            report_store._atomic_replace(self.target, b"changed")
        self.assertEqual(len(set(attempts)), 1)
        self.assertEqual(sleep.call_count, 2)
        self.assertEqual(self.target.read_bytes(), b"changed")
        self.assertEqual(list(self.root.glob(".*.tmp")), [])

    def test_exhausted_conflict_propagates_and_preserves_original(self):
        error = self.sharing_error()
        with patch.object(report_store.os, "replace", side_effect=error) as replace, \
                patch.object(report_store.time, "sleep") as sleep:
            with self.assertRaises(PermissionError) as failure:
                report_store._atomic_replace(self.target, b"changed")
        self.assertIs(failure.exception, error)
        self.assertEqual(replace.call_count, report_store._REPLACE_ATTEMPTS)
        self.assertEqual(sleep.call_count, report_store._REPLACE_ATTEMPTS - 1)
        self.assertEqual(self.target.read_bytes(), b"original")
        self.assertEqual(list(self.root.glob(".*.tmp")), [])

    def test_unrelated_error_is_not_retried(self):
        with patch.object(report_store.os, "replace", side_effect=OSError("disk full")) as replace, \
                patch.object(report_store.time, "sleep") as sleep:
            with self.assertRaisesRegex(OSError, "disk full"):
                report_store._atomic_replace(self.target, b"changed")
        replace.assert_called_once()
        sleep.assert_not_called()
        self.assertEqual(self.target.read_bytes(), b"original")

    @unittest.skipUnless(os.name == "nt", "Windows file-sharing semantics")
    def test_real_reader_closes_during_retry(self):
        reader = self.target.open("rb")
        self.addCleanup(reader.close)
        retried = threading.Event()
        closed = threading.Event()

        def release_reader():
            if retried.wait(3):
                reader.close()
                closed.set()

        worker = threading.Thread(target=release_reader)
        worker.start()
        try:
            def wait_for_reader(_seconds):
                retried.set()
                self.assertTrue(closed.wait(3))
            with patch.object(report_store.time, "sleep", side_effect=wait_for_reader):
                report_store._atomic_replace(self.target, b"changed")
        finally:
            retried.set()
            worker.join(timeout=4)
        self.assertEqual(self.target.read_bytes(), b"changed")


if __name__ == "__main__":
    unittest.main()
