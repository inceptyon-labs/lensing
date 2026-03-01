/** Escape HTML special characters to prevent XSS. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type TextToken = { type: 'text'; value: string };
export type PlaceholderToken = { type: 'placeholder'; path: string };
export type BlockToken = { type: 'block'; variable: string; content: string };
export type Token = TextToken | PlaceholderToken | BlockToken;

/** Parse text segment for {{placeholder}} tokens (no block handling). */
function parsePlaceholders(text: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\{\{([^#/}][^}]*)\}\}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    tokens.push({ type: 'placeholder', path: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  tokens.push({ type: 'text', value: text.slice(lastIndex) });
  return tokens;
}

/**
 * Parse a template string into tokens.
 * Tokens are: text, placeholder ({{path}}), or block ({{#each var}}...{{/each}}).
 */
export function parseTemplate(template: string): Token[] {
  const tokens: Token[] = [];
  const blockRegex = /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(template)) !== null) {
    const before = template.slice(lastIndex, match.index);
    if (before.length > 0 || lastIndex === 0) {
      tokens.push(...parsePlaceholders(before));
    }
    tokens.push({ type: 'block', variable: match[1], content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  const remaining = template.slice(lastIndex);
  if (remaining.length > 0 || tokens.length === 0) {
    tokens.push(...parsePlaceholders(remaining));
  }

  return tokens;
}

/** Resolve a dot-path (with optional array indices) against a data object. */
function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  return parts.reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/**
 * Render a template string with data, returning the interpolated result.
 * Values are HTML-escaped by default. Returns the original template when data is null/undefined.
 */
export function renderTemplate(
  template: string,
  data: Record<string, unknown> | null | undefined
): string {
  if (data == null) return template;

  const tokens = parseTemplate(template);

  return tokens
    .map((token) => {
      switch (token.type) {
        case 'text':
          return token.value;

        case 'placeholder': {
          const value = resolvePath(data, token.path);
          return value == null ? '' : escapeHtml(String(value));
        }

        case 'block': {
          const items = resolvePath(data, token.variable);
          if (!Array.isArray(items) || items.length === 0) return '';
          return items
            .map((item) => {
              if (typeof item === 'object' && item !== null) {
                return renderTemplate(token.content, item as Record<string, unknown>);
              }
              return renderTemplate(token.content, { this: item } as Record<string, unknown>);
            })
            .join('');
        }

        default:
          return '';
      }
    })
    .join('');
}
