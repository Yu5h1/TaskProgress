import { THEME_STORAGE_KEY, THEME_OPTIONS } from './theme-options.mjs';

(() => {
  const preference = UiTheme.loadThemePreference(() => localStorage, THEME_STORAGE_KEY, THEME_OPTIONS);
  globalThis.taskprogressThemeBoot = { preference, controller: UiTheme.applyTheme(document.documentElement, preference) };
  document.documentElement.dataset.theme = preference.mode;
  if (preference.mode === 'custom') document.documentElement.dataset.themeBase = preference.custom.base;
})();
