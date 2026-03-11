<script lang="ts">
  import BuilderWizard from './BuilderWizard.svelte';
  import WidgetTemplatePicker from './WidgetTemplatePicker.svelte';
  import BuilderPreview from './BuilderPreview.svelte';
  import AdminAiAssist from './AdminAiAssist.svelte';
  import type { WidgetTemplate } from './grapes-templates';
  import type { AiAssistResponse } from '@lensing/types';

  export let onCancel: () => void = () => {};
  export let onSaved: () => void = () => {};
  export let editPluginId: string | null = null;

  const STEPS = [
    { label: 'Metadata', key: 'metadata' },
    { label: 'Configure', key: 'configure' },
    { label: 'Preview & Save', key: 'preview-save' },
  ];

  const CATEGORIES = [
    { value: 'finance', label: 'Finance' },
    { value: 'weather', label: 'Weather' },
    { value: 'news', label: 'News' },
    { value: 'sports', label: 'Sports' },
    { value: 'media', label: 'Media' },
    { value: 'home', label: 'Home' },
    { value: 'utility', label: 'Utility' },
    { value: 'other', label: 'Other' },
  ];

  const CONNECTOR_TYPES = [
    { id: 'json_api', label: 'JSON API', description: 'Fetch data from a JSON REST API endpoint' },
    { id: 'rss_feed', label: 'RSS Feed', description: 'Subscribe to an RSS or Atom feed' },
    {
      id: 'static_data',
      label: 'Static Data',
      description: 'Define fixed data without an external source',
    },
  ];

  const REFRESH_DEFAULTS: Record<string, number> = {
    json_api: 300,
    rss_feed: 1800,
    static_data: 3600,
  };

  // Step 1: Metadata
  let name = '';
  let description = '';
  let category = '';

  // Step 2: Template & Code
  let html = '';
  let css = '';

  // Step 3: Data Source
  let connectorType = '';
  let connectorUrl = '';
  let connectorMethod = 'GET';
  let connectorHeaders: Array<{ key: string; value: string }> = [{ key: '', value: '' }];
  let refreshInterval = 300;

  // Secrets
  let lastAiResponse: AiAssistResponse | null = null;
  let secretValues: Record<string, string> = {};

  // Configure step mode
  let useAiAssist = true;
  let aiApplied = false;

  // Save state
  let saving = false;
  let saveError: string | null = null;
  let secretWarning: string | null = null;
  let currentStep = 0;
  let loadingEdit = false;

  // Preview fetch state
  let previewData: Record<string, unknown> | null = null;
  let previewFetching = false;
  let previewFetchError: string | null = null;

  // Load existing plugin source for editing
  if (editPluginId) {
    loadingEdit = true;
    void (async () => {
      try {
        // Fetch plugin admin entry for metadata
        const pluginsRes = await fetch('/plugins');
        if (pluginsRes.ok) {
          const all = (await pluginsRes.json()) as Array<{
            plugin_id: string;
            manifest: { name: string; description?: string };
          }>;
          const entry = all.find((p) => p.plugin_id === editPluginId);
          if (entry) {
            name = entry.manifest.name;
            description = entry.manifest.description ?? '';
          }
        }
        // Fetch source files (HTML, CSS, connector)
        const sourceRes = await fetch(`/plugins/${encodeURIComponent(editPluginId)}/source`);
        if (sourceRes.ok) {
          const source = (await sourceRes.json()) as {
            html: string;
            css: string;
            connector?: {
              type: string;
              url: string;
              method?: string;
              headers?: Record<string, string>;
              refreshInterval?: number;
            };
          };
          html = source.html;
          css = source.css;
          if (source.connector) {
            connectorType = source.connector.type;
            connectorUrl = source.connector.url || '';
            if (source.connector.method) connectorMethod = source.connector.method;
            if (source.connector.refreshInterval)
              refreshInterval = source.connector.refreshInterval;
            if (source.connector.headers) {
              connectorHeaders = Object.entries(source.connector.headers).map(([key, value]) => ({
                key,
                value,
              }));
            }
          }
        }
      } catch {
        // Non-fatal: start with empty form
      } finally {
        loadingEdit = false;
      }
    })();
  }

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  $: pluginId = editPluginId ?? slugify(name);

  $: dirty = pluginId !== '' || html.trim() !== '' || css.trim() !== '' || connectorType !== '';

  $: stepValid = [
    pluginId !== '' && (editPluginId !== null || (description.trim() !== '' && category !== '')),
    html.trim() !== '' &&
      connectorType !== '' &&
      (connectorType === 'static_data' || connectorUrl.trim() !== ''),
    true,
  ];

  // Reactively detect {{NAME}} placeholders in connector URL and headers
  $: detectedSecrets = (() => {
    const secretPattern = /\{\{(\w+)\}\}/g;
    const names = new Set<string>();
    for (const match of connectorUrl.matchAll(secretPattern)) {
      names.add(match[1]!);
    }
    for (const h of connectorHeaders) {
      for (const match of h.value.matchAll(secretPattern)) {
        names.add(match[1]!);
      }
    }
    return [...names].map((n) => ({
      name: n,
      description: lastAiResponse?.secrets?.find((s) => s.name === n)?.description ?? '',
    }));
  })();

  // Keep secretValues in sync with detected secrets
  $: {
    const next: Record<string, string> = {};
    for (const s of detectedSecrets) {
      next[s.name] = secretValues[s.name] ?? '';
    }
    secretValues = next;
  }

  // Step 1 handlers
  function handleNameInput(e: Event) {
    name = (e.target as HTMLInputElement).value;
  }

  function handleDescriptionInput(e: Event) {
    description = (e.target as HTMLTextAreaElement).value;
  }

  function handleCategoryChange(e: Event) {
    category = (e.target as HTMLSelectElement).value;
  }

  // Step 2 handlers
  function handleTemplateSelect(template: WidgetTemplate | null) {
    if (template) {
      html = template.html;
      css = template.css;
    } else {
      html = '';
      css = '';
    }
  }

  function handleHtmlInput(e: Event) {
    html = (e.target as HTMLTextAreaElement).value;
  }

  function handleCssInput(e: Event) {
    css = (e.target as HTMLTextAreaElement).value;
  }

  // Step 3 handlers
  function handleConnectorTypeSelect(type: string) {
    connectorType = type;
    refreshInterval = REFRESH_DEFAULTS[type] ?? 300;
  }

  function handleConnectorUrlInput(e: Event) {
    connectorUrl = (e.target as HTMLInputElement).value;
  }

  function handleConnectorMethodChange(e: Event) {
    connectorMethod = (e.target as HTMLSelectElement).value;
  }

  function handleRefreshIntervalInput(e: Event) {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    if (!isNaN(val) && val > 0) refreshInterval = val;
  }

  function handleHeaderKeyInput(i: number, e: Event) {
    connectorHeaders[i].key = (e.target as HTMLInputElement).value;
    connectorHeaders = [...connectorHeaders];
  }

  function handleHeaderValueInput(i: number, e: Event) {
    connectorHeaders[i].value = (e.target as HTMLInputElement).value;
    connectorHeaders = [...connectorHeaders];
  }

  function addHeader() {
    connectorHeaders = [...connectorHeaders, { key: '', value: '' }];
  }

  function handleSecretInput(secretName: string, e: Event) {
    secretValues[secretName] = (e.target as HTMLInputElement).value;
    secretValues = { ...secretValues };
  }

  async function handlePreviewFetch() {
    if (connectorType === 'static_data' || !connectorUrl.trim()) return;
    previewFetching = true;
    previewFetchError = null;
    try {
      const headersObj: Record<string, string> = {};
      for (const h of connectorHeaders) {
        if (h.key.trim()) headersObj[h.key.trim()] = h.value;
      }
      // eslint-disable-next-line no-undef
      const res = await fetch('/api/admin/builder/test-connector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: connectorType,
          url: connectorUrl,
          method: connectorMethod,
          headers: Object.keys(headersObj).length > 0 ? headersObj : undefined,
          secrets: secretValues,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Fetch failed (${res.status})`);
      }
      const result = (await res.json()) as { success: boolean; sample?: unknown; error?: string };
      if (!result.success) {
        throw new Error(result.error ?? 'Connector test failed');
      }
      previewData = (result.sample as Record<string, unknown>) ?? null;
    } catch (err) {
      previewFetchError = err instanceof Error ? err.message : 'Failed to fetch preview data';
    } finally {
      previewFetching = false;
    }
  }

  function handleAiAssistApply(
    response: AiAssistResponse,
    enteredSecretValues?: Record<string, string>
  ) {
    lastAiResponse = response;

    // Populate connector fields
    connectorType = response.connector.type;
    connectorUrl = response.connector.url || '';
    if (response.connector.method) {
      connectorMethod = response.connector.method;
    }
    refreshInterval = response.connector.refreshInterval ?? 300;

    // Convert headers object to array
    if (response.connector.headers) {
      connectorHeaders = Object.entries(response.connector.headers).map(([key, value]) => ({
        key,
        value,
      }));
    }

    // Populate template fields
    html = response.html;
    css = response.css || '';

    // Carry over any secrets entered in the AI result card
    if (enteredSecretValues) {
      secretValues = { ...secretValues, ...enteredSecretValues };
    }

    // Show manual fields for review/tweaking
    aiApplied = true;
  }

  function buildConnector(): {
    type: string;
    url: string;
    method?: string;
    headers?: Record<string, string>;
    refreshInterval?: number;
  } {
    const connector: {
      type: string;
      url: string;
      method?: string;
      headers?: Record<string, string>;
      refreshInterval?: number;
    } = {
      type: connectorType,
      url: connectorType === 'static_data' ? '' : connectorUrl,
      refreshInterval,
    };
    if (connectorType === 'json_api') {
      connector.method = connectorMethod;
      const headersObj: Record<string, string> = {};
      for (const h of connectorHeaders) {
        if (h.key.trim()) headersObj[h.key.trim()] = h.value;
      }
      if (Object.keys(headersObj).length > 0) connector.headers = headersObj;
    }
    return connector;
  }

  async function handleFinish() {
    saving = true;
    saveError = null;
    secretWarning = null;
    try {
      // eslint-disable-next-line no-undef
      const res = await fetch('/api/admin/builder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pluginId,
          name,
          version: '1.0.0',
          description,
          category,
          connector: buildConnector(),
          html,
          css,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Save failed (${res.status})`);
      }

      // Save any entered secrets
      const secretEntries = Object.entries(secretValues).filter(([, v]) => v.trim() !== '');
      if (secretEntries.length > 0) {
        const failures: string[] = [];
        for (const [key, value] of secretEntries) {
          try {
            // eslint-disable-next-line no-undef
            const secretRes = await fetch(
              `/plugins/${encodeURIComponent(pluginId)}/secrets/${encodeURIComponent(key)}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value }),
              }
            );
            if (!secretRes.ok) {
              failures.push(key);
            }
          } catch {
            failures.push(key);
          }
        }
        if (failures.length > 0) {
          secretWarning = `Plugin saved, but failed to store secrets: ${failures.join(', ')}. You can add them later from plugin settings.`;
        }
      }

      onSaved();
    } catch (err) {
      saveError = err instanceof Error ? err.message : 'Failed to save plugin';
      saving = false;
    }
  }
</script>

{#if editPluginId}
  <!-- Flat single-page edit form for existing plugins -->
  {#if loadingEdit}
    <p class="state-message">Loading plugin…</p>
  {:else}
    <div class="edit-form">
      <div class="edit-form__header">
        <h3 class="edit-form__title">Edit: {name}</h3>
        <span class="edit-form__id">{pluginId}</span>
      </div>

      <!-- Connector Config -->
      <section class="edit-form__section">
        <h4 class="edit-form__section-title">Data Source</h4>

        <div class="connector-type-picker">
          {#each CONNECTOR_TYPES as ctype (ctype.id)}
            <button
              type="button"
              class="connector-type-card"
              class:connector-type-card--selected={connectorType === ctype.id}
              on:click={() => handleConnectorTypeSelect(ctype.id)}
            >
              <span class="connector-type-card__label">{ctype.label}</span>
              <span class="connector-type-card__desc">{ctype.description}</span>
            </button>
          {/each}
        </div>

        {#if connectorType}
          <div class="connector-config">
            <div class="builder-field">
              <label class="builder-label" for="refresh-interval">Refresh Interval (seconds)</label>
              <input
                class="builder-input"
                id="refresh-interval"
                type="number"
                min="1"
                value={refreshInterval}
                on:input={handleRefreshIntervalInput}
                on:change={handleRefreshIntervalInput}
              />
            </div>

            {#if connectorType === 'json_api'}
              <div class="builder-field">
                <label class="builder-label" for="api-url">URL</label>
                <input
                  class="builder-input"
                  id="api-url"
                  type="url"
                  placeholder="https://api.example.com/data"
                  value={connectorUrl}
                  on:input={handleConnectorUrlInput}
                  on:change={handleConnectorUrlInput}
                />
              </div>

              <div class="builder-field">
                <label class="builder-label" for="api-method">Method</label>
                <select
                  class="builder-select"
                  id="api-method"
                  on:change={handleConnectorMethodChange}
                >
                  <option value="GET" selected={connectorMethod === 'GET'}>GET</option>
                  <option value="POST" selected={connectorMethod === 'POST'}>POST</option>
                  <option value="PUT" selected={connectorMethod === 'PUT'}>PUT</option>
                  <option value="DELETE" selected={connectorMethod === 'DELETE'}>DELETE</option>
                </select>
              </div>

              <div class="builder-field">
                <span class="builder-label">Headers</span>
                <div class="connector-headers">
                  {#each connectorHeaders as header, i (i)}
                    <div class="connector-header-row">
                      <input
                        class="builder-input"
                        placeholder="Header name"
                        value={header.key}
                        on:input={(e) => handleHeaderKeyInput(i, e)}
                        on:change={(e) => handleHeaderKeyInput(i, e)}
                        aria-label="Header key"
                      />
                      <input
                        class="builder-input"
                        placeholder="Header value"
                        value={header.value}
                        on:input={(e) => handleHeaderValueInput(i, e)}
                        on:change={(e) => handleHeaderValueInput(i, e)}
                        aria-label="Header value"
                      />
                    </div>
                  {/each}
                  <button
                    type="button"
                    class="wizard-btn wizard-btn--ghost connector-add-header"
                    on:click={addHeader}
                  >
                    + Add Header
                  </button>
                </div>
              </div>
            {:else if connectorType === 'rss_feed'}
              <div class="builder-field">
                <label class="builder-label" for="feed-url">Feed URL</label>
                <input
                  class="builder-input"
                  id="feed-url"
                  type="url"
                  placeholder="https://example.com/feed.xml"
                  value={connectorUrl}
                  on:input={handleConnectorUrlInput}
                  on:change={handleConnectorUrlInput}
                />
              </div>
            {/if}
          </div>
        {/if}

        {#if detectedSecrets.length > 0}
          <div class="builder-secrets">
            <h4 class="builder-secrets__title">Required API Keys</h4>
            <p class="builder-secrets__subtitle">
              Enter your credentials now, or add them later from plugin settings.
            </p>
            {#each detectedSecrets as secret (secret.name)}
              <div class="builder-secrets__item">
                <label class="builder-label" for="secret-{secret.name}">{secret.name}</label>
                <input
                  id="secret-{secret.name}"
                  type="password"
                  class="builder-input"
                  placeholder="Enter {secret.name}..."
                  value={secretValues[secret.name] ?? ''}
                  on:input={(e) => handleSecretInput(secret.name, e)}
                  on:change={(e) => handleSecretInput(secret.name, e)}
                />
                {#if secret.description}
                  <p class="builder-secrets__hint">{secret.description}</p>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <!-- HTML -->
      <section class="edit-form__section">
        <h4 class="edit-form__section-title">HTML</h4>
        <textarea
          class="builder-code"
          id="builder-html"
          value={html}
          on:input={handleHtmlInput}
          on:change={handleHtmlInput}
          rows="12"
          spellcheck="false"
        ></textarea>
      </section>

      <!-- CSS -->
      <section class="edit-form__section">
        <h4 class="edit-form__section-title">CSS</h4>
        <textarea
          class="builder-code"
          id="builder-css"
          value={css}
          on:input={handleCssInput}
          on:change={handleCssInput}
          rows="10"
          spellcheck="false"
        ></textarea>
      </section>

      <!-- Preview -->
      <section class="edit-form__section">
        <BuilderPreview
          {html}
          {css}
          sampleData={previewData}
          onFetchData={connectorType && connectorType !== 'static_data'
            ? handlePreviewFetch
            : undefined}
          fetching={previewFetching}
          fetchError={previewFetchError}
        />
      </section>

      <!-- Actions -->
      {#if saveError}
        <p class="builder-save-error">{saveError}</p>
      {/if}
      {#if secretWarning}
        <p class="builder-secrets__warning">{secretWarning}</p>
      {/if}

      <div class="edit-form__actions">
        <button type="button" class="wizard-btn wizard-btn--ghost" on:click={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          class="wizard-btn wizard-btn--primary"
          disabled={saving}
          on:click={handleFinish}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  {/if}
{:else}
  <BuilderWizard
    steps={STEPS}
    {stepValid}
    {dirty}
    onStepChange={(step) => (currentStep = step)}
    {onCancel}
    onFinish={handleFinish}
    let:step
  >
    {#if step === 0}
      <form class="builder-meta-form" on:submit|preventDefault>
        <div class="builder-field">
          <label class="builder-label" for="plugin-name">Plugin Name</label>
          <input
            class="builder-input"
            id="plugin-name"
            type="text"
            required
            placeholder="My Weather Widget"
            value={name}
            on:input={handleNameInput}
            on:change={handleNameInput}
          />
        </div>

        <div class="builder-field">
          <label class="builder-label" for="plugin-description">Description</label>
          <textarea
            class="builder-textarea"
            id="plugin-description"
            required
            placeholder="Describe what your plugin does..."
            value={description}
            on:input={handleDescriptionInput}
            on:change={handleDescriptionInput}
            rows="3"
          ></textarea>
        </div>

        <div class="builder-field">
          <label class="builder-label" for="plugin-category">Category</label>
          <select
            class="builder-select"
            id="plugin-category"
            required
            on:change={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {#each CATEGORIES as cat (cat.value)}
              <option value={cat.value}>{cat.label}</option>
            {/each}
          </select>
        </div>

        <div class="builder-field">
          <label class="builder-label" for="plugin-id">Plugin ID</label>
          <input
            class="builder-input builder-input--disabled"
            id="plugin-id"
            type="text"
            disabled
            bind:value={pluginId}
          />
          <p class="builder-hint">Auto-generated from the plugin name</p>
        </div>
      </form>
    {:else if step === 1}
      <div class="connector-step">
        <div class="builder-mode-toggle">
          <button
            type="button"
            class="builder-mode-toggle__btn"
            class:builder-mode-toggle__btn--active={useAiAssist}
            on:click={() => {
              useAiAssist = true;
            }}>AI Assist</button
          >
          <button
            type="button"
            class="builder-mode-toggle__btn"
            class:builder-mode-toggle__btn--active={!useAiAssist}
            on:click={() => {
              useAiAssist = false;
            }}>Manual</button
          >
        </div>

        {#if useAiAssist}
          <div class="ai-assist-section">
            <h3 class="ai-assist-title">AI-Assisted Setup</h3>
            <p class="ai-assist-desc">
              Paste API documentation and let AI generate your connector config, HTML, and CSS
            </p>
            <AdminAiAssist pluginContext={{ name, description }} onApply={handleAiAssistApply} />
          </div>
        {/if}

        {#if !useAiAssist || aiApplied}
          <WidgetTemplatePicker onSelect={handleTemplateSelect} />

          <div class="builder-code-editor">
            <div class="builder-field">
              <label class="builder-label" for="builder-html">HTML</label>
              <textarea
                class="builder-code"
                id="builder-html"
                value={html}
                on:input={handleHtmlInput}
                on:change={handleHtmlInput}
                rows="10"
                spellcheck="false"
                placeholder="Enter your widget HTML..."
              ></textarea>
            </div>

            <div class="builder-field">
              <label class="builder-label" for="builder-css">CSS</label>
              <textarea
                class="builder-code"
                id="builder-css"
                value={css}
                on:input={handleCssInput}
                on:change={handleCssInput}
                rows="8"
                spellcheck="false"
                placeholder="Enter your widget CSS..."
              ></textarea>
            </div>
          </div>

          <div class="connector-type-picker">
            {#each CONNECTOR_TYPES as ctype (ctype.id)}
              <button
                type="button"
                class="connector-type-card"
                class:connector-type-card--selected={connectorType === ctype.id}
                on:click={() => handleConnectorTypeSelect(ctype.id)}
              >
                <span class="connector-type-card__label">{ctype.label}</span>
                <span class="connector-type-card__desc">{ctype.description}</span>
              </button>
            {/each}
          </div>

          {#if connectorType}
            <div class="connector-config">
              <div class="builder-field">
                <label class="builder-label" for="refresh-interval"
                  >Refresh Interval (seconds)</label
                >
                <input
                  class="builder-input"
                  id="refresh-interval"
                  type="number"
                  min="1"
                  value={refreshInterval}
                  on:input={handleRefreshIntervalInput}
                  on:change={handleRefreshIntervalInput}
                />
              </div>

              {#if connectorType === 'json_api'}
                <div class="builder-field">
                  <label class="builder-label" for="api-url">URL</label>
                  <input
                    class="builder-input"
                    id="api-url"
                    type="url"
                    placeholder="https://api.example.com/data"
                    value={connectorUrl}
                    on:input={handleConnectorUrlInput}
                    on:change={handleConnectorUrlInput}
                  />
                </div>

                <div class="builder-field">
                  <label class="builder-label" for="api-method">Method</label>
                  <select
                    class="builder-select"
                    id="api-method"
                    on:change={handleConnectorMethodChange}
                  >
                    <option value="GET" selected={connectorMethod === 'GET'}>GET</option>
                    <option value="POST" selected={connectorMethod === 'POST'}>POST</option>
                    <option value="PUT" selected={connectorMethod === 'PUT'}>PUT</option>
                    <option value="DELETE" selected={connectorMethod === 'DELETE'}>DELETE</option>
                  </select>
                </div>

                <div class="builder-field">
                  <span class="builder-label">Headers</span>
                  <div class="connector-headers">
                    {#each connectorHeaders as header, i (i)}
                      <div class="connector-header-row">
                        <input
                          class="builder-input"
                          placeholder="Header name"
                          value={header.key}
                          on:input={(e) => handleHeaderKeyInput(i, e)}
                          on:change={(e) => handleHeaderKeyInput(i, e)}
                          aria-label="Header key"
                        />
                        <input
                          class="builder-input"
                          placeholder="Header value"
                          value={header.value}
                          on:input={(e) => handleHeaderValueInput(i, e)}
                          on:change={(e) => handleHeaderValueInput(i, e)}
                          aria-label="Header value"
                        />
                      </div>
                    {/each}
                    <button
                      type="button"
                      class="wizard-btn wizard-btn--ghost connector-add-header"
                      on:click={addHeader}
                    >
                      + Add Header
                    </button>
                  </div>
                </div>
              {:else if connectorType === 'rss_feed'}
                <div class="builder-field">
                  <label class="builder-label" for="feed-url">Feed URL</label>
                  <input
                    class="builder-input"
                    id="feed-url"
                    type="url"
                    placeholder="https://example.com/feed.xml"
                    value={connectorUrl}
                    on:input={handleConnectorUrlInput}
                    on:change={handleConnectorUrlInput}
                  />
                </div>
              {/if}
            </div>
          {/if}
        {/if}

        {#if detectedSecrets.length > 0}
          <div class="builder-secrets">
            <h4 class="builder-secrets__title">Required API Keys</h4>
            <p class="builder-secrets__subtitle">
              Enter your credentials now, or add them later from plugin settings.
            </p>
            {#each detectedSecrets as secret (secret.name)}
              <div class="builder-secrets__item">
                <label class="builder-label" for="secret-{secret.name}">{secret.name}</label>
                <input
                  id="secret-{secret.name}"
                  type="password"
                  class="builder-input"
                  placeholder="Enter {secret.name}..."
                  value={secretValues[secret.name] ?? ''}
                  on:input={(e) => handleSecretInput(secret.name, e)}
                  on:change={(e) => handleSecretInput(secret.name, e)}
                />
                {#if secret.description}
                  <p class="builder-secrets__hint">{secret.description}</p>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if step === 2}
      <BuilderPreview
        {html}
        {css}
        sampleData={previewData}
        onFetchData={connectorType && connectorType !== 'static_data'
          ? handlePreviewFetch
          : undefined}
        fetching={previewFetching}
        fetchError={previewFetchError}
      />

      {#if secretWarning}
        <p class="builder-secrets__warning">{secretWarning}</p>
      {/if}

      {#if saveError}
        <p class="builder-save-error">{saveError}</p>
      {/if}
    {/if}
  </BuilderWizard>
{/if}
