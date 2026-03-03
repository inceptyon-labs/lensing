<script lang="ts">
  import type { AiAssistResponse, AiAssistPluginContext, AiProviderId } from '@lensing/types';

  export let pluginContext: AiAssistPluginContext;
  export let availableProviders: AiProviderId[] = ['anthropic', 'deepseek', 'gemini'];
  export let onApply: ((response: AiAssistResponse) => void) | undefined = undefined;

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

  let selectedProvider: AiProviderId = availableProviders[0] ?? 'anthropic';
  let docsText = '';
  let generating = false;
  let result: AiAssistResponse | null = null;
  let errorMsg: string | null = null;
  let abortController: AbortController | null = null;

  // Reactive vars for textarea bind:value (non-nullable)
  let resultHtml = '';
  let resultCss = '';

  $: if (result) {
    resultHtml = result.html;
    resultCss = result.css ?? '';
  }

  $: canGenerate = docsText.trim().length > 0 && !generating && availableProviders.length > 0;

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

  function handleApply() {
    if (result && onApply) {
      onApply(result);
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
        <h3 class="ai-assist__result-title">Generated Configuration</h3>

        <div class="ai-assist__result-section">
          <strong>Connector Type:</strong>
          <span>{result.connector.type}</span>
        </div>

        {#if result.connector.url}
          <div class="ai-assist__result-section">
            <strong>URL:</strong>
            <span>{result.connector.url}</span>
          </div>
        {/if}

        <div class="ai-assist__result-section">
          <label class="builder-label" for="ai-result-html">HTML Template</label>
          <textarea
            class="builder-code"
            id="ai-result-html"
            bind:value={resultHtml}
            rows="6"
            readonly
            spellcheck="false"
          ></textarea>
        </div>

        <div class="ai-assist__result-section">
          <label class="builder-label" for="ai-result-css">CSS</label>
          <textarea
            class="builder-code"
            id="ai-result-css"
            bind:value={resultCss}
            rows="4"
            readonly
            spellcheck="false"
          ></textarea>
        </div>

        {#if result.explanation}
          <p class="ai-assist__explanation">{result.explanation}</p>
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
