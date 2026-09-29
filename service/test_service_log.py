"""Pure log tests: no listener or background process is started."""
import io
import logging
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from service.service_log import LogStream, ServiceLogHandler, install_service_log


class ServiceLogTests(unittest.TestCase):
    def test_rotation_unicode_and_retention(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'server.log'
            handler = ServiceLogHandler(path, max_bytes=180)
            try:
                stream = LogStream(handler, logging.INFO)
                for i in range(20):
                    stream.write(f'服務訊息 {i}\n')
                stream.flush()
                files = list(Path(folder).glob('server.log*'))
                self.assertEqual(len(files), 3)
                contents = [p.read_text(encoding='utf-8') for p in files]
                self.assertTrue(all(s.startswith('# TaskProgress log ') for s in contents))
                self.assertEqual(len({s.splitlines()[0] for s in contents}), 3)
                self.assertIn('服務訊息 19', path.read_text(encoding='utf-8'))
            finally:
                handler.close()

    def test_log_outside_viewer_and_explicit_console_tee(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            with self.assertRaises(ValueError):
                install_service_log(root / 'viewer' / 'private.log', root / 'viewer')
            console = io.StringIO()
            with patch('sys.stdout', console), patch('sys.stderr', io.StringIO()):
                handler = install_service_log(root / 'server.log', root / 'viewer', console=True)
                try:
                    print('啟動完成')
                    self.assertEqual(console.getvalue(), '啟動完成\n')
                    self.assertIn('啟動完成', (root / 'server.log').read_text(encoding='utf-8'))
                finally:
                    handler.close()

    def test_write_failure_does_not_recurse_through_stderr(self):
        with tempfile.TemporaryDirectory() as folder:
            handler = ServiceLogHandler(Path(folder) / 'server.log')
            try:
                stream = LogStream(handler, logging.ERROR)
                with patch.object(handler, 'emit', wraps=handler.emit), patch.object(handler, 'shouldRollover', side_effect=OSError('disk full')), patch('sys.stderr', stream):
                    stream.write('message')
                    self.assertEqual(handler.emit.call_count, 1)
            finally:
                handler.close()


if __name__ == '__main__':
    unittest.main()
