// Select the existing product transport at the host boundary; screens share one controller.
import { createChecklistBridgeTransport } from './checklist-bridge.js';
import { createChecklistHttpTransport } from './checklist-http-transport.js';
import { createDecisionDesktopTransport, createDecisionHttpTransport } from './decision-transport.js';

export function createDocumentTransport(kind, { params = new URLSearchParams(globalThis.location?.search), webview = globalThis.chrome?.webview } = {}) {
  if (kind === 'checklist') return webview
    ? createChecklistBridgeTransport(webview)
    : createChecklistHttpTransport({ scope: params.get('scope'), task: params.get('task') });
  if (kind === 'decisions') return webview
    ? createDecisionDesktopTransport(webview)
    : createDecisionHttpTransport(params.get('scope'), params.get('task'));
  throw new Error('Unsupported document kind: ' + kind);
}
