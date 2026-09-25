"""Cooperative scope locks; Windows mutexes release automatically after process death."""
from __future__ import annotations

import asyncio
import ctypes
import hashlib
import os
import tempfile
import time
from contextlib import contextmanager, asynccontextmanager
from pathlib import Path
from weakref import WeakKeyDictionary

_LOOP_LOCKS = WeakKeyDictionary()


class ScopeLock:
    def __init__(self, folder):
        root = Path(folder).resolve(strict=True)
        if not root.is_dir():
            raise ValueError("Report target must be a directory")
        key = hashlib.sha256(os.path.normcase(str(root)).encode("utf-8")).hexdigest()
        self.acquired = False
        if os.name == "nt":
            from ctypes import wintypes
            self.api = ctypes.WinDLL("kernel32", use_last_error=True)
            self.api.CreateMutexW.argtypes = [ctypes.c_void_p, wintypes.BOOL, wintypes.LPCWSTR]
            self.api.CreateMutexW.restype = wintypes.HANDLE
            self.api.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
            self.api.WaitForSingleObject.restype = wintypes.DWORD
            self.api.ReleaseMutex.argtypes = [wintypes.HANDLE]
            self.api.CloseHandle.argtypes = [wintypes.HANDLE]
            self.handle = self.api.CreateMutexW(None, False, "Local\\TaskProgress.Report." + key)
            if not self.handle:
                raise ctypes.WinError(ctypes.get_last_error())
        else:
            self.stream = open(Path(tempfile.gettempdir()) / ("taskprogress-report-" + key + ".lock"), "a+b")

    def attempt(self):
        if os.name == "nt":
            result = self.api.WaitForSingleObject(self.handle, 0)
            if result == 0xFFFFFFFF:
                raise ctypes.WinError(ctypes.get_last_error())
            self.acquired = result in (0, 0x80)
        else:
            import fcntl
            try:
                fcntl.flock(self.stream, fcntl.LOCK_EX | fcntl.LOCK_NB)
                self.acquired = True
            except BlockingIOError:
                pass
        return self.acquired

    def close(self):
        if os.name == "nt":
            if self.acquired:
                self.api.ReleaseMutex(self.handle)
            self.api.CloseHandle(self.handle)
        else:
            self.stream.close()


@contextmanager
def scope_lock(folder, timeout=10):
    lock = ScopeLock(folder)
    deadline = time.monotonic() + timeout
    try:
        while not lock.attempt():
            if time.monotonic() >= deadline:
                raise TimeoutError("Report scope is busy")
            time.sleep(.05)
        yield
    finally:
        lock.close()


@asynccontextmanager
async def async_scope_lock(folder, timeout=10):
    key = os.path.normcase(str(Path(folder).resolve(strict=True)))
    locks = _LOOP_LOCKS.setdefault(asyncio.get_running_loop(), {})
    local = locks.setdefault(key, asyncio.Lock())
    async with local:
        lock = ScopeLock(folder)
        deadline = time.monotonic() + timeout
        try:
            while not lock.attempt():
                if time.monotonic() >= deadline:
                    raise TimeoutError("Report scope is busy")
                await asyncio.sleep(.05)
            yield
        finally:
            lock.close()
