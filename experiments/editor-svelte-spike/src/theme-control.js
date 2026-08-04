import {
  applyThemePreference,
  loadThemePreference,
  preferenceWithMode,
  resolveSystemScheme,
  saveThemePreference,
} from "../../../viewer/assets/theme-model.js";

// Theme adapter for the Svelte surface. Components stay free of browser storage
// and DOM roots; the shared framework-neutral theme model owns every rule about
// what a preference means. Building a custom palette still belongs to the
// Viewer's theme dialog, so `自訂` is offered only when one already exists —
// duplicating that dialog here would create a second implementation.
const BASE_MODES = Object.freeze([
  { value: "system", label: "系統選擇" },
  { value: "light", label: "亮色" },
  { value: "dark", label: "暗色" },
]);

export function createThemeControl({
  root = globalThis.document?.documentElement,
  storage = globalThis.localStorage,
  matchMedia = globalThis.matchMedia?.bind(globalThis),
} = {}) {
  let preference = loadThemePreference(storage);

  function options() {
    return preference.custom
      ? [...BASE_MODES, { value: "custom", label: "自訂" }]
      : [...BASE_MODES];
  }

  function setMode(mode) {
    preference = preferenceWithMode(preference, mode, resolveSystemScheme(matchMedia));
    if (root) applyThemePreference(root, preference);
    saveThemePreference(storage, preference);
    return preference.mode;
  }

  return {
    get mode() {
      return preference.mode;
    },
    options,
    setMode,
  };
}
