<script lang="ts">
  import type { ConversationEntry } from '@lensing/types';

  interface Props {
    entry: ConversationEntry | null;
    isLoading?: boolean;
    autoDismissMs?: number;
  }

  const { entry = null, isLoading = false, autoDismissMs }: Props = $props();

  let visible = $state(entry !== null);
  let dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    if (entry) {
      visible = true;
      if (autoDismissMs) {
        clearTimeout(dismissTimeout);
        dismissTimeout = setTimeout(() => {
          visible = false;
        }, autoDismissMs);
      }
    }
    return () => {
      if (dismissTimeout) {
        clearTimeout(dismissTimeout);
      }
    };
  });
</script>

{#if isLoading}
  <div
    class="ask-response-card fixed bottom-6 right-6 bg-event-horizon border border-edge rounded-md p-4 flex items-center gap-3"
    data-testid="ask-response-card"
  >
    <div
      class="w-4 h-4 border-2 border-ember border-t-transparent rounded-full animate-spin"
      data-testid="ask-response-spinner"
    />
    <span class="text-sm text-dim-light">Processing your question...</span>
  </div>
{:else if visible && entry}
  <div
    class="ask-response-card fixed bottom-6 right-6 max-w-sm bg-event-horizon border border-edge rounded-md p-4 hover:border-edge-bright hover:shadow-[0_0_20px_var(--ember-trace)]"
    data-testid="ask-response-card"
  >
    <div class="mb-3">
      <p class="text-xs text-faint-light mb-2">Q: {entry.question}</p>
      <p class="ask-response-text text-sm text-starlight leading-normal">
        {entry.response}
      </p>
    </div>
    <div class="flex items-center justify-between pt-2 border-t border-edge-soft">
      <span class="text-xs text-faint-light">
        {entry.tool_calls_made} tool call{entry.tool_calls_made !== 1 ? 's' : ''}
      </span>
      <button
        class="text-xs text-dim-light hover:text-starlight transition-colors"
        onclick={() => (visible = false)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  </div>
{/if}

<style>
  :global(.bg-event-horizon) {
    background-color: hsl(240, 6%, 7%);
  }

  :global(.border-edge) {
    border-color: hsla(220, 10%, 50%, 0.12);
  }

  :global(.hover\:border-edge-bright:hover) {
    border-color: hsla(220, 10%, 50%, 0.2);
  }

  :global(.text-starlight) {
    color: hsl(220, 15%, 90%);
  }

  :global(.text-dim-light) {
    color: hsl(220, 10%, 62%);
  }

  :global(.text-faint-light) {
    color: hsl(220, 8%, 42%);
  }

  :global(.border-edge-soft) {
    border-color: hsla(220, 10%, 50%, 0.07);
  }

  :global(.shadow-\[0_0_20px_var\(--ember-trace\)\]) {
    box-shadow: 0 0 20px hsla(28, 85%, 55%, 0.06);
  }

  :global(.animate-spin) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  :global(.rounded-md) {
    border-radius: 8px;
  }

  :global(.leading-normal) {
    line-height: 1.5;
  }
</style>
