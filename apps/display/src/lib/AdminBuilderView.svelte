<script lang="ts">
  import BuilderWizard from './BuilderWizard.svelte';
  import WidgetTemplatePicker from './WidgetTemplatePicker.svelte';
  import BuilderPreview from './BuilderPreview.svelte';
  import AdminAiAssist from './AdminAiAssist.svelte';
  import type { WidgetTemplate } from './grapes-templates';
  import type { AiAssistResponse } from '@lensing/types';

  export let onCancel: () => void = () => {};
  export let onSaved: () => void = () => {};

  const STEPS = [
    { label: 'Metadata', key: 'metadata' },
    { label: 'Template & Code', key: 'template-code' },
    { label: 'Data Source', key: 'data-source' },
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

  // Save state
  let saving = false;
  let saveError: string | null = null;
  let currentStep = 0;

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  $: pluginId = slugify(name);

  $: dirty = pluginId !== '' || html.trim() !== '' || css.trim() !== '' || connectorType !== '';

  $: stepValid = [
    pluginId !== '' && description.trim() !== '' && category !== '',
    html.trim() !== '',
    connectorType !== '' && (connectorType === 'static_data' || connectorUrl.trim() !== ''),
    true,
  ];

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

  function handleAiAssistApply(e: CustomEvent<AiAssistResponse>) {
    const response = e.detail;

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
      onSaved();
    } catch (err) {
      saveError = err instanceof Error ? err.message : 'Failed to save plugin';
    } finally {
      saving = false;
    }
  }
</script>

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
  {:else if step === 2}
    <div class="connector-step">
      <div class="ai-assist-section">
        <h3 class="ai-assist-title">🤖 AI-Assisted Setup</h3>
        <p class="ai-assist-desc">
          Paste API documentation and let AI generate your connector config
        </p>
        <AdminAiAssist pluginContext={{ name, description }} on:apply={handleAiAssistApply} />
      </div>

      <div class="connector-divider">
        <span>or configure manually</span>
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
    </div>
  {:else if step === 3}
    <BuilderPreview {html} {css} sampleData={{}} />

    {#if saveError}
      <p class="builder-save-error">{saveError}</p>
    {/if}
  {/if}
</BuilderWizard>
