// Preserve the existing host interface while the product bootstrap owns Theme.
export function createThemeControl() {
  if (!globalThis.taskprogressTheme) throw new Error('Product Theme bootstrap must run before the Viewer host');
  return globalThis.taskprogressTheme;
}
