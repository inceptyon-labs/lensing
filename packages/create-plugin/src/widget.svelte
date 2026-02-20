<!--
  Starter Plugin — Widget Component

  This Svelte component is your plugin's UI. It renders inside the Lensing
  display app inside a sandboxed iframe — so it has access to standard
  browser APIs but NOT to Node.js or the server module directly.

  To fetch data from your server module, call sdk.request(payload).
  The Lensing runtime routes the request to server.ts → handleRequest().

  SDK Convention: Receive data as props and emit updates via callbacks.
  Keep rendering logic here; put data fetching and secrets in server.ts.

  Props:
    - id:       Unique instance ID for this widget (string)
    - data:     Current data from the server module (Record<string, unknown>)
    - onUpdate: Callback to trigger a server-side data refresh

  Svelte 5 runes are used throughout — see https://svelte.dev/docs/svelte/runes
-->

<script lang="ts">
  // ── Props ──────────────────────────────────────────────────────────────────

  /**
   * id: The unique identifier for this widget instance.
   * Used for accessibility attributes and event tracking.
   */
  let {
    id,
    data,
    onUpdate,
  }: {
    id: string;
    data: Record<string, unknown>;
    onUpdate: (newData?: unknown) => void;
  } = $props();

  // ── Derived state ──────────────────────────────────────────────────────────

  /**
   * isLoading: True while waiting for a server response.
   * Set this to true before sdk.request() and false when it resolves.
   */
  let isLoading = $state(false);

  /**
   * error: Holds the last error message, if any.
   * Clear on successful data load.
   */
  let error = $state<string | null>(null);

  // ── Event handlers ─────────────────────────────────────────────────────────

  /**
   * handleRefresh: Called when the user clicks the refresh button.
   *
   * SDK Convention:
   *   1. Set isLoading = true immediately (optimistic UI)
   *   2. Await onUpdate to trigger server-side refresh and wait for completion
   *   3. The runtime will re-render with new data props when ready
   *
   * You can also call sdk.request() directly for fine-grained control:
   *   const result = await sdk.request({ action: 'fetch-data', data: { id: 42 } });
   */
  async function handleRefresh() {
    isLoading = true;
    error = null;
    try {
      // Await the update callback to ensure async operations complete
      const result = await Promise.resolve(onUpdate());
      if (result instanceof Error) {
        error = result.message;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      isLoading = false;
    }
  }
</script>

<!-- ── Template ──────────────────────────────────────────────────────────── -->

<!--
  Root container: Use semantic HTML and ARIA attributes.
  The Lensing layout system constrains width/height via CSS variables --widget-width / --widget-height.
-->
<div class="plugin-widget" aria-label="Starter Plugin" role="region">
  <!-- Loading state: shown while awaiting server data -->
  {#if isLoading}
    <div class="state-loading" aria-live="polite">
      <span class="spinner" aria-hidden="true" />
      <span class="sr-only">Loading...</span>
    </div>

    <!-- Error state: shown when server request fails -->
  {:else if error}
    <div class="state-error" role="alert">
      <p class="error-message">{error}</p>
      <button class="btn-retry" onclick={handleRefresh}> Retry </button>
    </div>

    <!-- Content state: shown with data from server module -->
  {:else}
    <div class="content">
      <!--
        Render your widget content here. The `data` prop contains whatever
        your server module returned from handleRequest('fetch-data').

        Example: if server returns { title: 'Weather', temperature: 72 }
        then: data.title === 'Weather', data.temperature === 72
      -->
      <header class="widget-header">
        <h2 class="widget-title">
          {String(data.title ?? 'Starter Plugin')}
        </h2>
        <button
          class="btn-refresh"
          onclick={handleRefresh}
          aria-label="Refresh data"
          title="Refresh"
        >
          ↺
        </button>
      </header>

      <div class="widget-body">
        <!--
          Replace this with your actual widget content.
          Tips:
          - Use CSS custom properties (var(--color-accent)) for theming
          - Match the ambient dark aesthetic of the Lensing dashboard
          - Keep it readable at both small and medium widget sizes
        -->
        <p class="placeholder">✦ Your widget content goes here</p>

        {#if data.value !== undefined}
          <div class="data-value">
            {String(data.value)}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<!-- ── Styles ──────────────────────────────────────────────────────────────
  SDK Convention: Scope ALL styles to .plugin-widget to avoid leaking
  into the Lensing shell. The iframe sandbox provides isolation but
  scoped styles are good practice and enable future inline embedding.

  Use the Lensing CSS custom properties for colors and spacing:
    --color-bg       Background (dark)
    --color-surface  Card/panel background
    --color-text     Primary text
    --color-muted    Secondary/muted text
    --color-accent   Accent/highlight
    --radius-md      Medium border radius
    --spacing-sm/md/lg  Spacing scale
-->
<style>
  .plugin-widget {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: var(--color-surface, #1a1a2e);
    color: var(--color-text, #e0e0e0);
    border-radius: var(--radius-md, 8px);
    padding: var(--spacing-md, 16px);
    box-sizing: border-box;
    font-family: inherit;
  }

  /* Loading state */
  .state-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    opacity: 0.6;
  }

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-muted, #888);
    border-top-color: var(--color-accent, #7b9cdb);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Screen-reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Error state */
  .state-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: var(--spacing-sm, 8px);
    color: var(--color-error, #f06060);
  }

  .error-message {
    margin: 0;
    font-size: 0.875rem;
    text-align: center;
  }

  /* Content */
  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: var(--spacing-sm, 8px);
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-sm, 8px);
  }

  .widget-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--color-text, #e0e0e0);
  }

  .widget-body {
    flex: 1;
    overflow-y: auto;
  }

  .placeholder {
    color: var(--color-muted, #888);
    font-style: italic;
    margin: 0;
  }

  .data-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent, #7b9cdb);
    margin-top: var(--spacing-sm, 8px);
  }

  /* Buttons */
  .btn-refresh,
  .btn-retry {
    background: transparent;
    border: 1px solid var(--color-muted, #888);
    color: var(--color-muted, #888);
    border-radius: var(--radius-sm, 4px);
    cursor: pointer;
    padding: 2px 8px;
    font-size: 0.8rem;
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  .btn-refresh:hover,
  .btn-retry:hover {
    color: var(--color-text, #e0e0e0);
    border-color: var(--color-text, #e0e0e0);
  }
</style>
