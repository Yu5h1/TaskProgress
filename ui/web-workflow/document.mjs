import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { bootstrap } from './bootstrap.mjs';
import { html, View, productBack, productTheme } from './common.mjs';

await bootstrap('document');
history.scrollRestoration = 'manual';
const params = new URLSearchParams(location.search);

/**
 * Read-only page for one Markdown document inside a registered scope. The service resolves
 * the scope's folder and renders the Markdown with raw HTML disabled; this page only asks
 * for it by scope and scope-relative path, shows it, and scrolls to the requested section.
 */
class DocumentPage extends View {
  constructor(target) {
    super(target, {}, (_, v) => v.template());
    this.scope = params.get('scope') ?? '';
    this.path = params.get('path') ?? '';
    this.card = params.get('card');
    this.message = '載入中…';
    this.on(window, 'hashchange', () => this.reveal());
  }
  owner() {
    if (!this.scope) return null;
    const query = new URLSearchParams({ scope: this.scope });
    if (this.card) query.set('pin', this.card);
    return { href: `/?${query}`, title: `${this.scope} Report` };
  }
  async load() {
    if (!this.scope || !this.path) { this.failure = '連結缺少 scope 或 path。'; this.draw(); return; }
    try {
      const response = await fetch(`/__taskprogress/v1/documents/${encodeURIComponent(this.scope)}?${new URLSearchParams({ path: this.path })}`,
        { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.detail ? `${body.title}：${body.detail}` : body?.title ?? `HTTP ${response.status}`);
      this.document = body;
      document.title = `${body.title} — TaskProgress`;
    } catch (error) {
      this.failure = `文件無法開啟。${error instanceof Error ? error.message : ''}`;
    }
    this.draw();
    this.reveal();
    if (document.readyState !== 'complete') this.on(window, 'load', () => this.reveal(), { once: true });
  }
  reveal() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) this.target.querySelector(`[id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'start' });
  }
  template() {
    const d = this.document;
    return html`<main class="document-page"><header class="checklist-header"><div><div class="replica-title-row">${productBack(this.owner())}<h1>${d?.title ?? 'TaskProgress 文件'}</h1></div><p class="document-path"><code>${this.scope}</code> › ${this.path}</p></div>${productTheme()}</header>
      ${d ? html`<article class="document-body">${unsafeHTML(d.html)}</article>` : html`<p class=${this.failure ? 'checklist-notice checklist-error' : 'checklist-notice'} role=${this.failure ? 'alert' : 'status'}>${this.failure ?? this.message}</p>`}</main>`;
  }
}

const app = new DocumentPage(document.querySelector('#app'));
app.draw();
await app.load();
globalThis.taskprogressWebUi = { kind: 'document', app };
addEventListener('pagehide', event => { if (!event.persisted) app.destroy(); });
