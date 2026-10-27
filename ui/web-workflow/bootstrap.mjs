import { registerUi, buttonDesign } from '@web/ui';
import { applyTheme, loadThemePreference, saveThemePreference, preferenceWithMode } from '@web/theme';
import { THEME_STORAGE_KEY, THEME_OPTIONS } from './theme-options.mjs';

// Product owns persistence and navigation; Web owns theme resolution and controls.
export function createBackLink(owner = null) {
  const link = document.createElement('a');
  link.className = 'demo-back-link'; link.href = owner?.href ?? '/';
  link.setAttribute('aria-label', owner ? `回到 ${owner.title}` : '回到 Scopes 入口');
  link.title = owner ? `回到 ${owner.title}` : '回到 Scopes 入口';
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [name, value] of Object.entries({ viewBox: '0 0 24 24', width: '32', height: '32', fill: 'none', stroke: 'currentColor', 'stroke-width': '4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) icon.setAttribute(name, value);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M19 12H5m6-6-6 6 6 6');
  icon.append(path); link.append(icon);
  return link;
}

export async function bootstrap(page) {
  registerUi();
  document.documentElement.style.setProperty('--taskprogress-icon-hover-scale', String(buttonDesign.tokens.ghostHoverIconScale.value));
  document.documentElement.dataset.taskprogressUi = 'web-ui-workflow';
  const options = THEME_OPTIONS;
  const boot = globalThis.taskprogressThemeBoot;
  let preference = boot?.preference ?? loadThemePreference(() => localStorage, THEME_STORAGE_KEY, options);
  boot?.controller.dispose(); delete globalThis.taskprogressThemeBoot;
  const control = document.createElement('ui-theme-control');
  const system = matchMedia('(prefers-color-scheme: dark)');
  let controller;
  const sync = () => {
    control.preference = preference;
    control.systemScheme = system.matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = preference.mode;
    if (preference.mode === 'custom') document.documentElement.dataset.themeBase = preference.custom.base;
    else delete document.documentElement.dataset.themeBase;
  };
  const connect = () => {
    if (controller) return;
    preference = loadThemePreference(() => localStorage, THEME_STORAGE_KEY, options);
    controller = applyTheme(document.documentElement, preference, options);
    system.addEventListener('change', sync); sync();
  };
  const commit = next => {
    preference = saveThemePreference(() => localStorage, THEME_STORAGE_KEY, next, options);
    controller?.update(preference); sync();
    return preference;
  };
  connect();
  control.addEventListener('theme-change', event => commit(event.detail.preference));
  globalThis.taskprogressTheme = {
    control,
    get mode() { return preference.mode; },
    get custom() { return preference.custom ?? null; },
    get systemScheme() { return system.matches ? 'dark' : 'light'; },
    setMode(mode) { return commit(preferenceWithMode(preference, mode, this.systemScheme, options)); },
    applyCustom(custom) { return commit({ ...preference, mode: 'custom', custom }); },
    destroy() {},
  };
  addEventListener('pagehide', () => { controller?.dispose(); controller = undefined; system.removeEventListener('change', sync); });
  addEventListener('pageshow', connect);
  if (page === 'viewer') {
    const title = document.querySelector('#report-title');
    if (title) { const heading = document.createElement('div'); heading.className = 'replica-title-row'; title.before(heading); heading.append(createBackLink(), title); }
  }
  const scope = new URLSearchParams(location.search).get('scope');
  const desktop = page !== 'viewer' && typeof globalThis.chrome?.webview?.postMessage === 'function';
  let editable = desktop;
  if (!desktop && scope) {
    try { const result = await fetch('/__taskprogress/v1/capabilities/' + encodeURIComponent(scope)); editable = result.ok && (await result.json()).editable; } catch {}
  }
  return { editable, desktop };
}
