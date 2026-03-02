export const SANDBOX_MSG = {
  DATA: 'widget-data',
  RESIZE: 'widget-resize',
} as const;

export interface SandboxDataMessage {
  type: typeof SANDBOX_MSG.DATA;
  pluginId: string;
  data: Record<string, unknown>;
}

export interface SandboxResizeMessage {
  type: typeof SANDBOX_MSG.RESIZE;
  pluginId: string;
  height: number;
}

/**
 * Returns true if the plugin HTML or manifest indicates custom JavaScript is present.
 */
export function hasCustomJs(
  html: string,
  manifest?: { server_entry?: string; [key: string]: unknown }
): boolean {
  if (manifest?.server_entry) return true;
  // Match actual <script> or <SCRIPT> tags, not escaped HTML entities
  return /<script[\s>]/i.test(html);
}

/**
 * Builds an iframe srcdoc string containing the plugin HTML, CSS, optional JS,
 * and a bootstrap script that handles postMessage data injection and resize reporting.
 */
export function buildSandboxSrcdoc(
  html: string,
  css: string,
  js?: string,
  pluginId?: string
): string {
  const bootstrapScript = `
(function() {
  function reportHeight() {
    var h = document.body ? document.body.scrollHeight : 0;
    window.parent.postMessage({ type: '${SANDBOX_MSG.RESIZE}', pluginId: '${pluginId || ''}', height: h }, '*');
  }

  window.addEventListener('message', function(event) {
    if (!event.data || event.data.type !== '${SANDBOX_MSG.DATA}') return;
    var detail = event.data;
    // Dispatch custom event so plugin JS can listen on document
    document.dispatchEvent(new CustomEvent('widget-data-update', { detail: detail }));
    // Report height after potential layout changes
    setTimeout(reportHeight, 0);
  });

  document.addEventListener('DOMContentLoaded', reportHeight);
})();
`;

  const customJsBlock = js ? `<${'script'}>${js}</${'script'}>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>${css}</style>
</head>
<body>
${html}
<${'script'}>${bootstrapScript}</${'script'}>
${customJsBlock}
</body>
</html>`;
}
