// Status capsules open related sources/dependencies: one target as a link, several through a menu
// button, an unreadable target never as a link, and nothing clickable while editing.
import assert from "node:assert/strict";
import test from "node:test";
import { loadTemplates, markup, view } from "./helpers/web-ui-template.mjs";
import "../viewer/assets/priority-policy.js";

const { taskCard } = await loadTemplates("viewer");

const web = { done: false, available: true, card: "Web 卡", label: "Web 卡 › A", href: "/?scope=web&pin=card" };
const checklist = { done: false, available: true, card: "ui.checklist", label: "ui.checklist 第 2 項", href: "/checklist/?scope=ux&task=ui" };
const gone = { done: false, available: false, label: "gone › D", href: null };

function waitingItem(pendingWaits) {
  return { id: "w", title: "Waiting", derivedState: "waiting", derivedStateLabel: "等待中", derivedStateTone: "warning", pendingWaits };
}

function itemHtml(item, editing = false) {
  const task = { id: 't', title: 'T', summary: 'S', status: 'in_progress', pending_items: [item] };
  return markup(taskCard({ editing, progress: { t: { completed: 0, total: 1 } },
    policy: globalThis.TaskProgressPriorityPolicy, onCommand() {}, onAddItem() {} }, view(), task, {}));
}

function capsuleHtml(pendingWaits, editing = false) {
  const html = itemHtml(waitingItem(pendingWaits), editing);
  const start = html.indexOf("等待中");
  return html.slice(Math.max(0, start - 400), start + 20);
}

test("one waited target makes the capsule a link to it", () => {
  const html = capsuleHtml([web, { ...web, label: "Web 卡 › B" }]);
  assert.match(html, /<a class="item-status-capsule status-warning is-link" href="\/\?scope=web&amp;pin=card[^" ]*"/u);
});

test("several waited targets open a menu instead of guessing one", () => {
  const html = capsuleHtml([web, checklist, gone]);
  assert.match(html, /<button type="button" class="item-status-capsule status-warning is-link"[^>]*aria-expanded="false"/u);
  assert.doesNotMatch(html, /<a class="item-status-capsule/u);
});

test("an unreadable target alone and an edited row stay plain capsules", () => {
  assert.doesNotMatch(capsuleHtml([gone]), /is-link/u);
  assert.doesNotMatch(capsuleHtml([web], true), /is-link/u);
});

const sourceRef = { available: true, kind: "checklist", label: "Checklist", task: "review", href: "/checklist/?scope=ux&task=review" };

test("blocked and checklist-derived statuses link to their bound source", () => {
  for (const derivedState of [null, "needs_fix", "conditions_to_revise", "awaiting_user_dispute", "awaiting_user", "awaiting_acceptance", "in_progress", "not_started", "done"]) {
    const html = itemHtml({ id: "s", title: "Source", status: "blocked", sourceRef,
      derivedState, derivedStateLabel: derivedState, derivedStateTone: "warning" });
    assert.match(html, /<a class="item-status-capsule [^"]*is-link" href="\/checklist\/\?scope=ux&amp;task=review[^" ]*"/u, derivedState ?? "blocked");
  }
  const decision = itemHtml({ id: "d", title: "Decision", status: "blocked",
    sourceRef: { ...sourceRef, kind: "decision", label: "Decision", href: "/decisions/?scope=ux&task=review" } });
  assert.match(decision, /<a class="item-status-capsule [^"]*is-link" href="\/decisions\/\?scope=ux&amp;task=review[^" ]*"/u);
});

test("needs-fix keeps dependency links and offers all targets when it also has a source", () => {
  const item = { ...waitingItem([web]), derivedState: "needs_fix", derivedStateLabel: "需修正" };
  assert.match(itemHtml(item), /<a class="item-status-capsule [^"]*is-link" href="\/\?scope=web&amp;pin=card[^" ]*"/u);
  assert.match(itemHtml({ ...item, sourceRef }), /<button type="button" class="item-status-capsule [^"]*is-link"/u);
  // A waiting item points at its dependency even when it has its own checklist.
  assert.match(itemHtml({ ...waitingItem([web]), sourceRef }), /<a class="item-status-capsule [^"]*is-link" href="\/\?scope=web&amp;pin=card[^" ]*"/u);
});

test("a missing source, unavailable source or edit mode does not invent a status link", () => {
  const item = { id: "b", title: "Blocked", status: "blocked" };
  for (const html of [itemHtml(item), itemHtml({ ...item, sourceRef: { ...sourceRef, available: false } }), itemHtml({ ...item, sourceRef }, true)]) {
    assert.doesNotMatch(html, /class="item-status-capsule [^"]*is-link"/u);
  }
});
