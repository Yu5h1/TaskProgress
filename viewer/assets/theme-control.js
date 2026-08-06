import {
  applyThemePreference,
  createCustomPalette,
  loadThemePreference,
  preferenceWithMode,
  resolveSystemScheme,
  saveThemePreference,
} from "./theme-model.js";

/*
 * Theme adapter for every host.
 *
 * Browser storage and the document root stop here, so the shared ThemeControl
 * component stays free of both; the framework-neutral theme model owns every
 * rule about what a preference means. A host creates one of these, feeds its
 * values into the component as props, and calls back into it when the reader
 * changes something.
 */
export function createThemeControl({
  root = globalThis.document?.documentElement,
  storage = globalThis.localStorage,
  matchMedia = globalThis.matchMedia?.bind(globalThis),
} = {}) {
  let preference = loadThemePreference(storage);
  if (root) applyThemePreference(root, preference);

  function commit(next) {
    preference = saveThemePreference(storage, next);
    if (root) applyThemePreference(root, preference);
    return preference;
  }

  return {
    get mode() {
      return preference.mode;
    },
    get custom() {
      return preference.custom ?? null;
    },
    get systemScheme() {
      return resolveSystemScheme(matchMedia);
    },
    setMode(mode) {
      return commit(preferenceWithMode(preference, mode, resolveSystemScheme(matchMedia)));
    },
    applyCustom(palette) {
      return commit({
        version: 1,
        mode: "custom",
        custom: createCustomPalette(palette?.base, palette ?? {}),
      });
    },
  };
}
