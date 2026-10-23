// The 等待中 capsule opens what the item waits on: one target as a link, several through a menu
// button, an unreadable target never as a link, and nothing clickable while editing.
import assert from "node:assert/strict";
import test, { before, after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import "../viewer/assets/priority-policy.js";

let server;
let TaskCard;
let render;
before(async () => {
  server = await createServer({
    configFile: false, plugins: [svelte()],
    resolve: { alias: { "@editor": fileURLToPath(new URL("../viewer/assets", import.meta.url)) } },
    server: { middlewareMode: true, watch: null },
  });
  TaskCard = (await server.ssrLoadModule("/experiments/editor-svelte-spike/src/TaskCard.svelte")).default;
  ({ render } = await server.ssrLoadModule("svelte/server"));
});
after(async () => { await server?.close(); });

const web = { done: false, available: true, card: "Web 卡", label: "Web 卡 › A", href: "/?scope=web&pin=card" };
const checklist = { done: false, available: true, card: "ui.checklist", label: "ui.checklist 第 2 項", href: "/checklist/?scope=ux&task=ui" };
const gone = { done: false, available: false, label: "gone › D", href: null };

function waitingItem(pendingWaits) {
  return { id: "w", title: "Waiting", derivedState: "waiting", derivedStateLabel: "等待中", derivedStateTone: "warning", pendingWaits };
}

function capsuleHtml(pendingWaits, editing = false) {
  const html = render(TaskCard, { props: {
    task: { id: "t", title: "T", summary: "S", status: "in_progress", pending_items: [waitingItem(pendingWaits)] },
    editing, progress: { completed: 0, total: 1 },
    policy: globalThis.TaskProgressPriorityPolicy, onCommand() {}, onAddItem() {},
  } }).body;
  const start = html.indexOf("等待中");
  return html.slice(Math.max(0, start - 400), start + 20);
}

test("one waited target makes the capsule a link to it", () => {
  const html = capsuleHtml([web, { ...web, label: "Web 卡 › B" }]);
  assert.match(html, /<a class="item-status-capsule status-warning is-link" href="\/\?scope=web&amp;pin=card"/u);
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
