import { registerUi } from '@web/ui';
import { applyTheme, loadThemePreference, saveThemePreference, preferenceWithMode } from '@web/theme';
import { THEME_STORAGE_KEY, THEME_OPTIONS } from './theme-options.mjs';

// Product owns persistence and navigation; Web owns theme resolution and controls.
export function createBackLink() {
  const link = document.createElement('a');
  link.className = 'demo-back-link'; link.href = '/';
  link.textContent = '←'; link.setAttribute('aria-label', '上一頁');
  link.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    try {
      if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
        event.preventDefault(); history.back();
      }
    } catch { /* Use the ordinary root link. */ }
  });
  return link;
}

export async function bootstrap(page) {
  registerUi();
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
  let editable = false;
  if (scope) {
    try { const result = await fetch('/__taskprogress/v1/capabilities/' + encodeURIComponent(scope)); editable = result.ok && (await result.json()).editable; } catch {}
  }
  return { editable };
}
