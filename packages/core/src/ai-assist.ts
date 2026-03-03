import type { AiAssistResponse, AiAssistPluginContext } from '@lensing/types';
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
  "explanation": "Brief description of what was generated"
}

Connector type rules:
- Use "json_api" for REST APIs returning JSON
- Use "rss_feed" for RSS/Atom feed URLs
- Use "static_data" for hardcoded data (no external source)

For API keys/tokens in headers, use {{SECRET_NAME}} placeholder syntax (e.g., "Authorization": "Bearer {{API_KEY}}").
In HTML, use {{fieldName}} placeholders to reference fields from the API response.
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

  return {
    connector: {
      type: connector.type as 'json_api' | 'rss_feed' | 'static_data',
      url: typeof connector.url === 'string' ? connector.url : '',
      method: typeof connector.method === 'string' ? connector.method : undefined,
      headers:
        connector.headers && typeof connector.headers === 'object'
          ? (connector.headers as Record<string, string>)
          : undefined,
      refreshInterval:
        typeof connector.refreshInterval === 'number' ? connector.refreshInterval : 300,
    },
    html: obj.html as string,
    css: typeof obj.css === 'string' ? obj.css : '',
    explanation: typeof obj.explanation === 'string' ? obj.explanation : undefined,
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
