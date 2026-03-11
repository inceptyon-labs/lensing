import type { AiAssistResponse, AiAssistPluginContext, AiAssistSecretInfo } from '@lensing/types';
import type { AiProvider } from './ai-assist-providers';

const DEFAULT_MAX_DOCS_SIZE = 50_000; // 50 KB
const DEFAULT_MODEL: Record<string, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  deepseek: 'deepseek-chat',
  gemini: 'gemini-2.0-flash',
};

export interface AiAssistGenerateInput {
  docsText: string;
  pluginContext: AiAssistPluginContext;
}

export interface AiAssistOptions {
  provider: AiProvider;
  model?: string;
  maxDocsSize?: number;
}

export interface AiAssistInstance {
  generate(input: AiAssistGenerateInput): Promise<AiAssistResponse>;
}

const SYSTEM_PROMPT = `You are an expert at building lensing display widgets. Your task is to analyze API documentation and generate a complete widget configuration.

You must return ONLY a valid JSON object with this exact structure:
{
  "connector": {
    "type": "json_api" | "rss_feed" | "static_data",
    "url": "https://...",
    "method": "GET",
    "headers": { "Header-Name": "value or {{SECRET_NAME}}" },
    "refreshInterval": 300
  },
  "html": "<div>{{field}}</div>",
  "css": ".widget { ... }",
  "explanation": "Brief description of what was generated",
  "secrets": [{ "name": "API_KEY", "description": "Your API key from https://..." }]
}

Connector type rules:
- Use "json_api" ONLY for endpoints that return a JSON response body. The platform calls response.json() to parse the data — if the endpoint returns CSV, XML, HTML, or plain text, it will FAIL. If the API only offers non-JSON formats, use "static_data" and explain in the explanation field that the API does not support JSON.
- Use "rss_feed" for RSS/Atom XML feed URLs (the platform has a built-in RSS parser).
- Use "static_data" for hardcoded data (no external source), or when the API does not return JSON.
- CRITICAL: Verify that the specific endpoint and query parameters you choose actually return JSON. Many APIs have endpoints that return CSV or other formats by default (e.g., Alpha Vantage LISTING_STATUS returns CSV). Always pick a JSON-returning endpoint.

CRITICAL — Data flow (how the API response reaches the template):
The platform fetches the connector URL, parses the JSON response, and passes the RAW response object directly as the template data. There is NO transformation layer. The template placeholders must exactly match the keys in the API response.

Example 1 — API returns a flat object:
  API response: { "symbol": "AAPL", "price": 150.25, "change": -1.2 }
  Template: <div>{{symbol}}: \${{price}} ({{change}})</div>

Example 2 — API returns nested object:
  API response: { "Global Quote": { "01. symbol": "AAPL", "05. price": "150.25" } }
  Template: <div>{{["Global Quote"]["01. symbol"]}}: \${{["Global Quote"]["05. price"]}}</div>

Example 3 — API returns an object with an array field:
  API response: { "articles": [{ "title": "...", "source": "..." }] }
  Template: {{#each articles}}<div>{{title}} — {{source}}</div>{{/each}}
  NOTE: {{#each articles}} works because "articles" is a key in the response object.

Example 4 — API returns a top-level array:
  API response: [{ "name": "Item 1" }, { "name": "Item 2" }]
  This CANNOT be iterated directly because the template data must be an object with named keys.
  For top-level arrays, use a wrapper field or pick specific indices: {{[0].name}}, {{[1].name}}.

IMPORTANT: You must understand the actual JSON response shape of the API endpoint you choose, and write template placeholders that match it exactly. Do NOT guess field names — use the names from the documentation. If the docs show a response like {"data": {"temperature": 72}}, the template must use {{data.temperature}}, NOT {{temperature}}.

For API keys/tokens in headers or URLs, use {{SECRET_NAME}} placeholder syntax (e.g., "Authorization": "Bearer {{API_KEY}}").
For each {{SECRET_NAME}} placeholder used, include a "secrets" entry with the name and a helpful description of what the credential is and where to get it.

HTML template syntax rules:
- Use {{fieldName}} for simple top-level keys.
- Use dot notation for nested objects: {{weather.temp}}
- Use bracket notation for keys containing spaces, dots, or special characters: {{["Global Quote"]["01. symbol"]}}
- Use array indices: {{items[0].title}}
- Use {{#each items}}...{{/each}} to loop over arrays. Inside the loop, use {{fieldName}} for object properties or {{this}} for primitive values.
- The template engine does NOT support conditionals, ternary expressions, or any logic — only simple value interpolation and #each loops.
- Keep the CSS self-contained. Use a class prefix matching the widget name to avoid style conflicts. Do NOT use external fonts or CDN links.

Design system — ALL widgets MUST follow these rules:
- This is a 24/7 ambient display with a gravitational lensing dark theme. Widgets sit on a near-black background.
- Background: use transparent or hsl(240, 8%, 4%) for the widget root. The widget sits on a near-black page — do NOT add a visible card surface. NEVER use gradients, bright backgrounds, or white backgrounds.
- Primary text: hsl(220, 15%, 90%) — cool off-white, NEVER pure #fff.
- Secondary text (labels, metadata): hsl(220, 10%, 62%).
- Muted text (timestamps, captions): hsl(220, 8%, 42%).
- Accent (sparingly — active states, emphasis): hsl(28, 85%, 55%) — warm ember orange.
- Positive values: hsl(160, 45%, 45%) — muted teal-green.
- Negative values: hsl(0, 60%, 55%) — desaturated red.
- Warning: hsl(38, 65%, 50%).
- Borders: hsla(220, 10%, 50%, 0.12) — subtle, nearly invisible.
- Border radius: 8px for cards.
- Font: inherit (Inter is set globally). Use font-weight 600-700 for titles/hero numbers, 400-500 for body.
- No drop shadows. Use border glow for depth: box-shadow: 0 0 0 1px hsla(220, 10%, 50%, 0.12).
- Hero metrics (main numbers like price, temperature): large (1.5-2rem), bold, primary text color.
- Labels: small (0.75-0.875rem), weight 500-600, secondary text color, uppercase with letter-spacing 0.04em.
- Minimum text size: 0.875rem (14px) — must be readable from across a room.
- Keep DOM minimal — this runs on constrained hardware (Pi 3B).

Return ONLY the JSON object, no markdown, no explanation outside the JSON.`;

/** Extract a JSON object from text that may contain markdown fences or surrounding prose */
function extractJson(text: string): unknown {
  // Try direct parse first
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall through to fence extraction
    }
  }

  // Extract from ```json ... ``` or ``` ... ``` block
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    return JSON.parse(fenceMatch[1].trim());
  }

  // Try to find a JSON object anywhere in the text
  const objMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objMatch) {
    return JSON.parse(objMatch[0]);
  }

  throw new SyntaxError('No JSON object found in LLM response');
}

/** Validate and normalise raw parsed output into AiAssistResponse */
function validateOutput(raw: unknown): AiAssistResponse {
  if (!raw || typeof raw !== 'object') {
    throw new Error('LLM response is not a JSON object');
  }

  const obj = raw as Record<string, unknown>;

  // Validate connector
  if (!obj.connector || typeof obj.connector !== 'object') {
    throw new Error('Invalid response: missing connector object');
  }

  const connector = obj.connector as Record<string, unknown>;

  if (!connector.type || typeof connector.type !== 'string') {
    throw new Error('Invalid response: connector.type is required');
  }

  if (!['json_api', 'rss_feed', 'static_data'].includes(connector.type as string)) {
    throw new Error(`Invalid response: unknown connector type "${connector.type}"`);
  }

  // Validate html
  if (typeof obj.html !== 'string') {
    throw new Error('Invalid response: html field is required');
  }

  const connectorResult = {
    type: connector.type as 'json_api' | 'rss_feed' | 'static_data',
    url: typeof connector.url === 'string' ? connector.url : '',
    method: typeof connector.method === 'string' ? connector.method : undefined,
    headers:
      connector.headers && typeof connector.headers === 'object'
        ? (connector.headers as Record<string, string>)
        : undefined,
    refreshInterval:
      typeof connector.refreshInterval === 'number' ? connector.refreshInterval : 300,
  };

  // Parse secrets from LLM response
  const llmSecrets = new Map<string, string>();
  if (Array.isArray(obj.secrets)) {
    for (const entry of obj.secrets) {
      if (entry && typeof entry === 'object') {
        const s = entry as Record<string, unknown>;
        if (typeof s.name === 'string') {
          llmSecrets.set(s.name, typeof s.description === 'string' ? s.description : '');
        }
      }
    }
  }

  // Auto-detect {{NAME}} in connector URL and headers as fallback
  const secretPattern = /\{\{(\w+)\}\}/g;
  const detectedNames = new Set<string>();
  for (const match of connectorResult.url.matchAll(secretPattern)) {
    detectedNames.add(match[1]!);
  }
  if (connectorResult.headers) {
    for (const value of Object.values(connectorResult.headers)) {
      for (const match of value.matchAll(secretPattern)) {
        detectedNames.add(match[1]!);
      }
    }
  }

  // Merge: LLM descriptions take precedence, auto-detect fills gaps
  const secrets: AiAssistSecretInfo[] = [];
  for (const name of detectedNames) {
    secrets.push({
      name,
      description: llmSecrets.get(name) || `API credential: ${name}`,
    });
  }

  return {
    connector: connectorResult,
    html: obj.html as string,
    css: typeof obj.css === 'string' ? obj.css : '',
    explanation: typeof obj.explanation === 'string' ? obj.explanation : undefined,
    ...(secrets.length > 0 ? { secrets } : {}),
  };
}

/** Create an AI assist service that generates connector configs from API documentation */
export function createAiAssist(options: AiAssistOptions): AiAssistInstance {
  const { provider, maxDocsSize = DEFAULT_MAX_DOCS_SIZE } = options;
  const model = options.model ?? DEFAULT_MODEL[provider.provider] ?? 'claude-sonnet-4-20250514';

  return {
    async generate(input: AiAssistGenerateInput): Promise<AiAssistResponse> {
      const { docsText, pluginContext } = input;

      if (!docsText || docsText.trim() === '') {
        throw new Error('Documentation text is required and cannot be empty');
      }

      if (docsText.length > maxDocsSize) {
        throw new Error(
          `Documentation text exceeds maximum size of ${maxDocsSize} characters (got ${docsText.length})`
        );
      }

      const contextLines: string[] = [];
      contextLines.push(`Plugin name: ${pluginContext.name}`);
      if (pluginContext.description) {
        contextLines.push(`Plugin description: ${pluginContext.description}`);
      }

      const userPrompt = `${contextLines.join('\n')}

API Documentation:
${docsText}

Generate the widget configuration JSON now.`;

      const messages = [{ role: 'user' as const, content: `${SYSTEM_PROMPT}\n\n${userPrompt}` }];

      const rawText = await provider.generate(messages, model);

      let parsed: unknown;
      try {
        parsed = extractJson(rawText);
      } catch (err) {
        throw new Error(
          `Failed to parse JSON from LLM response: ${err instanceof Error ? err.message : String(err)}`
        );
      }

      return validateOutput(parsed);
    },
  };
}
