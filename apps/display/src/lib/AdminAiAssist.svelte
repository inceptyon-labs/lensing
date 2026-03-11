<script lang="ts">
  import type { AiAssistResponse, AiAssistPluginContext, AiProviderId } from '@lensing/types';

  export let pluginContext: AiAssistPluginContext;
  export let availableProviders: AiProviderId[] = ['anthropic', 'deepseek', 'gemini'];
  export let onApply:
    | ((response: AiAssistResponse, secretValues?: Record<string, string>) => void)
    | undefined = undefined;

  const PROVIDER_MODELS: Record<AiProviderId, string> = {
    anthropic: 'claude-sonnet-4-20250514',
    deepseek: 'deepseek-chat',
    gemini: 'gemini-2.0-flash',
  };

  const PROVIDER_LABELS: Record<AiProviderId, string> = {
    anthropic: 'Anthropic (Claude)',
    deepseek: 'DeepSeek',
    gemini: 'Google Gemini',
  };

  const TYPE_LABELS: Record<string, string> = {
    json_api: 'JSON API',
    rss_feed: 'RSS Feed',
    static_data: 'Static Data',
  };

  let selectedProvider: AiProviderId = availableProviders[0] ?? 'anthropic';
  let docsText = '';
  let generating = false;
  let result: AiAssistResponse | null = null;
  let errorMsg: string | null = null;
  let abortController: AbortController | null = null;
  let enteredSecrets: Record<string, string> = {};

  $: canGenerate = docsText.trim().length > 0 && !generating && availableProviders.length > 0;

  // Reset secret inputs when result changes
  $: if (result?.secrets) {
    const next: Record<string, string> = {};
    for (const s of result.secrets) {
      next[s.name] = enteredSecrets[s.name] ?? '';
    }
    enteredSecrets = next;
  }

  function highlightSecrets(text: string): string {
    return text.replace(/\{\{(\w+)\}\}/g, '<span class="ai-assist__secret-hl">{{$1}}</span>');
  }

  function handleProviderChange(e: Event) {
    selectedProvider = (e.target as HTMLSelectElement).value as AiProviderId;
  }

  function handleDocsInput(e: Event) {
    docsText = (e.target as HTMLTextAreaElement).value;
  }

  function handleAbort() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    generating = false;
  }

  async function handleGenerate() {
    if (!canGenerate) return;

    generating = true;
    result = null;
    errorMsg = null;

    abortController = new AbortController();

    try {
      // eslint-disable-next-line no-undef
      const res = await fetch('/api/admin/builder/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          model: PROVIDER_MODELS[selectedProvider],
          docsTextOrUrl: docsText,
          pluginContext,
        }),
        signal: abortController.signal,
      });

      const body = (await res.json()) as AiAssistResponse & { error?: string };

      if (!res.ok) {
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      result = body;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User aborted — don't show error
      } else {
        errorMsg = err instanceof Error ? err.message : 'Generation failed';
      }
    } finally {
      generating = false;
      abortController = null;
    }
  }

  function handleSecretInput(name: string, e: Event) {
    enteredSecrets[name] = (e.target as HTMLInputElement).value;
    enteredSecrets = { ...enteredSecrets };
  }

  function handleApply() {
    if (result && onApply) {
      // Pass any entered secrets along with the response
      const nonEmpty: Record<string, string> = {};
      for (const [k, v] of Object.entries(enteredSecrets)) {
        if (v.trim()) nonEmpty[k] = v;
      }
      onApply(result, Object.keys(nonEmpty).length > 0 ? nonEmpty : undefined);
    }
  }
</script>

<div class="ai-assist">
  {#if availableProviders.length === 0}
    <p class="ai-assist__notice">
      AI assist is not configured. Add a provider API key in Settings to enable AI assist.
    </p>
  {:else}
    <div class="ai-assist__field">
      <label class="builder-label" for="ai-provider">AI Provider</label>
      <select
        class="builder-select"
        id="ai-provider"
        value={selectedProvider}
        on:change={handleProviderChange}
        disabled={generating}
      >
        {#each availableProviders as provider (provider)}
          <option value={provider}>{PROVIDER_LABELS[provider] ?? provider}</option>
        {/each}
      </select>
    </div>

    <div class="ai-assist__field">
      <label class="builder-label" for="ai-docs">API Documentation</label>
      <textarea
        class="builder-code"
        id="ai-docs"
        value={docsText}
        on:input={handleDocsInput}
        on:change={handleDocsInput}
        rows="8"
        placeholder="Paste API documentation here (endpoints, response shapes, authentication)..."
        disabled={generating}
      ></textarea>
    </div>

    <div class="ai-assist__actions">
      {#if generating}
        <button type="button" class="wizard-btn wizard-btn--primary" disabled> Generating… </button>
        <button type="button" class="wizard-btn wizard-btn--ghost" on:click={handleAbort}>
          Abort
        </button>
      {:else}
        <button
          type="button"
          class="wizard-btn wizard-btn--primary"
          on:click={handleGenerate}
          disabled={!canGenerate}
        >
          Generate
        </button>
      {/if}
    </div>

    {#if errorMsg}
      <p class="ai-assist__error">{errorMsg}</p>
    {/if}

    {#if result}
      <div class="ai-assist__result">
        {#if result.explanation}
          <p class="ai-assist__explanation">{result.explanation}</p>
        {/if}

        <div class="ai-assist__connector-card">
          <div class="ai-assist__connector-row">
            <span class="ai-assist__type-badge"
              >{TYPE_LABELS[result.connector.type] ?? result.connector.type}</span
            >
            {#if result.connector.method}
              <span class="ai-assist__method-tag">{result.connector.method}</span>
            {/if}
          </div>

          {#if result.connector.url}
            <span class="ai-assist__url">{@html highlightSecrets(result.connector.url)}</span>
          {/if}

          {#if result.connector.headers && Object.keys(result.connector.headers).length > 0}
            <table class="ai-assist__headers-table">
              <thead>
                <tr><th>Header</th><th>Value</th></tr>
              </thead>
              <tbody>
                {#each Object.entries(result.connector.headers) as [key, value] (key)}
                  <tr>
                    <td>{key}</td>
                    <td>{@html highlightSecrets(value)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </div>

        {#if result.secrets && result.secrets.length > 0}
          <div class="ai-assist__secrets-card">
            <div class="ai-assist__secrets-header">
              <strong class="ai-assist__secrets-title">Required API Keys</strong>
              <span class="ai-assist__secrets-subtitle"
                >Enter your credentials now, or add them later from plugin settings</span
              >
            </div>
            <div class="ai-assist__secrets-list">
              {#each result.secrets as secret (secret.name)}
                <div class="ai-assist__secret-item">
                  <label class="builder-label" for="ai-secret-{secret.name}">{secret.name}</label>
                  <input
                    id="ai-secret-{secret.name}"
                    type="password"
                    class="builder-input"
                    placeholder="Enter {secret.name}..."
                    value={enteredSecrets[secret.name] ?? ''}
                    on:input={(e) => handleSecretInput(secret.name, e)}
                    on:change={(e) => handleSecretInput(secret.name, e)}
                  />
                  {#if secret.description}
                    <span class="ai-assist__secret-desc">{secret.description}</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <details class="ai-assist__code-details">
          <summary>HTML Template</summary>
          <textarea class="builder-code" rows="6" readonly spellcheck="false" value={result.html}
          ></textarea>
        </details>

        {#if result.css}
          <details class="ai-assist__code-details">
            <summary>CSS</summary>
            <textarea class="builder-code" rows="4" readonly spellcheck="false" value={result.css}
            ></textarea>
          </details>
        {/if}

        <div class="ai-assist__apply">
          <button type="button" class="wizard-btn wizard-btn--primary" on:click={handleApply}>
            Apply to Builder
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
