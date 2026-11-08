"""Reads one Markdown document inside a registered scope and renders it for the document page."""
from __future__ import annotations

import re
import urllib.parse
from pathlib import Path, PurePosixPath

MAX_DOCUMENT_BYTES = 2 * 1024 * 1024
MAX_PATH_LENGTH = 300
DOCUMENT_PAGE = "/document/"
_SCHEME = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
_SLUG_DROP = re.compile(r"[^\w\- ]", re.UNICODE)


class DocumentUnavailable(RuntimeError):
    """The Markdown renderer (markdown-it-py) is not installed in the service's Python."""


def resolve_scope_document(root: Path, value: object) -> tuple[Path, str]:
    """Maps a request path to a Markdown file inside the scope root, or raises ValueError.

    Accepts only a relative POSIX path to a ``.md`` file with no empty, ``.``, ``..`` or
    dot-prefixed segment, and refuses any file that resolves outside ``root`` (symbolic
    links included). Returns the resolved file and its normalized relative path.
    """
    if not isinstance(value, str) or not 0 < len(value) <= MAX_PATH_LENGTH:
        raise ValueError("path must be a non-empty string of at most 300 characters")
    if "\\" in value or "\0" in value or value.startswith("/") or _SCHEME.match(value):
        raise ValueError("path must be relative to the scope and use forward slashes")
    parts = value.split("/")
    if any(part in {"", ".", ".."} or part.startswith(".") for part in parts):
        raise ValueError("path must not contain empty, '.', '..' or hidden segments")
    if PurePosixPath(value).suffix.lower() != ".md":
        raise ValueError("only Markdown (.md) documents can be opened")
    base = root.resolve()
    target = (base / Path(*parts)).resolve()
    if not target.is_relative_to(base):
        raise ValueError("path resolves outside the scope")
    return target, "/".join(parts)


def github_slug(text: str) -> str:
    """GitHub's heading anchor: lowercase, punctuation dropped, spaces become hyphens."""
    return _SLUG_DROP.sub("", text.strip().lower()).replace(" ", "-")


def document_href(scope: str, path: str, fragment: str = "") -> str:
    query = urllib.parse.urlencode({"scope": scope, "path": path})
    return f"{DOCUMENT_PAGE}?{query}" + (f"#{fragment}" if fragment else "")


def render_document(text: str, *, file: Path, scope_roots: dict[str, Path]) -> dict[str, object]:
    """Renders Markdown to HTML with raw HTML disabled, GitHub heading ids, and relative
    ``.md`` links pointed at the document page of whichever registered scope holds them.

    Other relative links cannot be served, so they render as plain text that keeps the
    original target as its tooltip.
    """
    try:
        from markdown_it import MarkdownIt
    except ImportError as error:
        raise DocumentUnavailable("markdown-it-py is not installed") from error
    parser = MarkdownIt("commonmark", {"html": False}).enable(["table", "strikethrough"])
    tokens = parser.parse(text)
    roots = sorted(((name, folder.resolve()) for name, folder in scope_roots.items()),
                   key=lambda pair: len(pair[1].parts), reverse=True)
    used: dict[str, int] = {}
    title = None
    for index, token in enumerate(tokens):
        if token.type == "heading_open" and index + 1 < len(tokens):
            label = _plain_text(tokens[index + 1])
            slug = github_slug(label)
            count = used.get(slug, 0)
            used[slug] = count + 1
            token.attrSet("id", slug if count == 0 else f"{slug}-{count}")
            if title is None and token.tag == "h1":
                title = label
        if token.type == "inline" and token.children:
            _rewrite_links(token.children, file, roots)
    return {"title": title or file.name, "html": parser.renderer.render(tokens, parser.options, {})}


def _plain_text(inline) -> str:
    return "".join(child.content for child in inline.children or [] if child.type in {"text", "code_inline"})


def _rewrite_links(children, file: Path, roots: list[tuple[str, Path]]) -> None:
    pending: list[bool] = []
    for token in children:
        if token.type == "link_open":
            href = str(token.attrGet("href") or "")
            target = _link_target(href, file, roots)
            if target is None and _is_relative(href):
                token.tag, token.attrs = "span", {"class": "document-link-unavailable", "title": href}
                pending.append(True)
                continue
            if target is not None:
                token.attrSet("href", target)
            pending.append(False)
        elif token.type == "link_close" and pending and pending.pop():
            token.tag = "span"


def _is_relative(href: str) -> bool:
    return bool(href) and not href.startswith(("/", "#", "?")) and not _SCHEME.match(href)


def _link_target(href: str, file: Path, roots: list[tuple[str, Path]]) -> str | None:
    if not _is_relative(href):
        return None
    location, _, fragment = href.partition("#")
    location = urllib.parse.unquote(location.split("?", 1)[0])
    if PurePosixPath(location).suffix.lower() != ".md":
        return None
    target = (file.parent / Path(*location.split("/"))).resolve()
    for scope, root in roots:
        if target.is_relative_to(root):
            relative = target.relative_to(root).as_posix()
            try:
                resolve_scope_document(root, relative)
            except ValueError:
                return None
            return document_href(scope, relative, fragment)
    return None
