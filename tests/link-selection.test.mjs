import test from "node:test";
import assert from "node:assert/strict";
import { checklistReturnHref, checklistReturnOwner, createLinkSelection, documentLinkTarget, linkSelectionHref, readLinkSelection } from "../viewer/assets/link-selection.js";

const base = "http://127.0.0.1:8001/?scope=task-progress";
test("checklist links return to their exact source item and reject unrelated targets", () => {
  const href = checklistReturnHref('/checklist/?scope=other&task=example', 'card', 'item', base);
  const dest = new URL(href);
  const owner = { title: 'Report', href: '/?scope=other' };
  const result = checklistReturnOwner(owner, dest.search, dest.href);
  const source = new URL(result.href);
  assert.equal(source.searchParams.get('scope'), 'task-progress');
  assert.equal(source.searchParams.get('pin'), 'card');
  assert.equal(source.hash, '#item-card--item');
  assert.equal(checklistReturnOwner(owner, '?return_to=https%3A%2F%2Fevil.example%2F%3Fscope%3Dx%23item-x', dest.href), owner);
  assert.equal(checklistReturnOwner(owner, '?return_to=%2Fchecklist%2F%3Fscope%3Dx%23item-x', dest.href), owner);
  assert.equal(checklistReturnOwner(owner, '', dest.href), owner);
  assert.equal(checklistReturnHref('https://example.com/checklist/?scope=x', 'card', 'item', base), 'https://example.com/checklist/?scope=x');
});
test("internal targets carry the source tone and preserve addressing", () => {
  const href = linkSelectionHref("/checklist/?scope=ux&task=input&work_item=5#checks", "danger", base);
  const url = new URL(href, base);
  assert.equal(url.searchParams.get("link-tone"), "danger");
  assert.equal(url.searchParams.get("work_item"), "5");
  assert.equal(url.hash, "#checks");
  assert.deepEqual(readLinkSelection(url.search), { tone: "danger", id: "5" });
  assert.deepEqual(readLinkSelection("?scope=ux&pin=card&link-tone=warning"), { tone: "warning", id: "card" });
  const retired = linkSelectionHref('/?scope=ux&pin=old', 'retired', base);
  assert.deepEqual(readLinkSelection(new URL(retired, base).search), { tone: 'retired', id: 'old' });
  for (const tone of ['obsolete','discontinued']) {
    const href=linkSelectionHref('/?scope=ux&pin=old',tone,base);
    assert.deepEqual(readLinkSelection(new URL(href,base).search),{tone,id:'old'});
  }
});
test("external, unrelated and invalid links keep their original destinations", () => {
  for (const href of ["https://example.com/?scope=ux", "/docs/?scope=ux", "/?pin=card", "mailto:a@example.com"])
    assert.equal(linkSelectionHref(href, "danger", base), href);
  assert.equal(linkSelectionHref("/?scope=ux", "invalid", base), "/?scope=ux");
  assert.equal(readLinkSelection("?link-tone=invalid"), null);
});
test("slow or filtered loads do not consume the initial selection", () => {
  const selection = createLinkSelection({ tone: "danger", id: "5" });
  assert.equal(selection.claim([]), null);
  assert.equal(selection.selectionChanged(null), null);
  assert.equal(selection.claim([1, 2]), null);
  assert.deepEqual(selection.claim([1, 5]), { id: 5, tone: "danger" });
  assert.equal(selection.selectionChanged(5), "danger");
  assert.equal(selection.claim([5]), null);
});
test("cancellation or selecting another card consumes the colour permanently", () => {
  for (const next of [null, "other"]) {
    const selection = createLinkSelection({ tone: "warning", id: "target" });
    selection.claim(["target"]);
    assert.equal(selection.selectionChanged(next), null);
    assert.equal(selection.selectionChanged("target"), null);
    assert.equal(selection.claim(["target"]), null);
  }
});
test("a whole-document link selects its first displayed card once", () => {
  const selection = createLinkSelection(readLinkSelection("?scope=ux&task=review&link-tone=active"));
  assert.deepEqual(selection.claim([3, 1]), { id: 3, tone: "active" });
  assert.equal(selection.selectionChanged(3), "active");
  selection.selectionChanged(null);
  assert.equal(selection.claim([1, 3]), null);
  assert.equal(createLinkSelection(null).claim([1]), null);
});
test("whole-document navigation exposes a target before status filtering", () => {
  const request = readLinkSelection("?scope=ux&task=review&link-tone=success");
  assert.equal(documentLinkTarget(request, []), null);
  assert.equal(documentLinkTarget(request, [3, 1]), "3");
  assert.equal(documentLinkTarget({ ...request, id: "1" }, [3, 1]), "1");
  assert.equal(documentLinkTarget(null, [3, 1]), null);
});
