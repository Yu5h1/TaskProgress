"""Bounded, local-only stdout/stderr capture for the TaskProgress service process."""
import io
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
import sys
import uuid


class ServiceLogHandler(RotatingFileHandler):
    def __init__(self, path, max_bytes=1024 * 1024):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        super().__init__(path, maxBytes=max_bytes, backupCount=2, encoding='utf-8')
        self.doRollover()

    def doRollover(self):
        super().doRollover()
        self.stream.write('# TaskProgress log ' + uuid.uuid4().hex + '\n')
        self.stream.flush()

    def handleError(self, record):
        # stderr is this handler too. Logging's default diagnostic would recurse
        # indefinitely if the disk fills or rotation fails.
        pass


class LogStream(io.TextIOBase):
    def __init__(self, handler, level, console=None):
        self.handler = handler
        self.level = level
        self.console = console

    @property
    def encoding(self):
        return 'utf-8'

    def write(self, text):
        if self.console is not None:
            self.console.write(text)
            self.console.flush()
        if text.strip():
            record = logging.LogRecord('localserver', self.level, '', 0, text.rstrip('\r\n')[:65536], (), None)
            self.handler.handle(record)
        return len(text)

    def flush(self):
        self.handler.flush()


def install_service_log(path, exposed_root, console=False):
    destination = Path(path).resolve()
    if destination.is_relative_to(Path(exposed_root).resolve()):
        raise ValueError('Service logs must stay outside the public Viewer root')
    handler = ServiceLogHandler(destination)
    handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(message)s'))
    sys.stdout = LogStream(handler, logging.INFO, sys.stdout if console else None)
    sys.stderr = LogStream(handler, logging.ERROR, sys.stderr if console else None)
    return handler
