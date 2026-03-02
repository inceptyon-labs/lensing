<script lang="ts">
  export let state: 'loading' | 'stale' | 'waiting' | 'ready' = 'ready';
  export let width: number | undefined = undefined;
  export let height: number | undefined = undefined;

  $: wrapperStyle = [
    width !== undefined ? `width: ${width}px` : '',
    height !== undefined ? `height: ${height}px` : '',
    'transition: opacity 200ms ease',
  ]
    .filter(Boolean)
    .join('; ');
</script>

<div class="widget-indicator" style={wrapperStyle}>
  {#if state === 'loading'}
    <div
      class="widget-indicator__shimmer"
      style="animation: shimmer 1.5s ease-in-out infinite; position: absolute; inset: 0; background: var(--starlight, hsl(220, 15%, 90%)); border-radius: var(--radius-md, 8px);"
    ></div>
  {:else if state === 'stale'}
    <span
      class="widget-indicator__stale-icon"
      style="opacity: 0.4; color: hsl(220, 10%, 62%); position: absolute; bottom: 8px; right: 8px; font-size: 0.875rem;"
    >🕐</span>
  {:else if state === 'waiting'}
    <p
      class="widget-indicator__waiting"
      style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--faint-light, hsl(220, 10%, 45%)); font-size: 0.875rem; margin: 0;"
    >
      Waiting for data...
    </p>
  {/if}
</div>
