<script lang="ts">
  export let data: unknown = null;
  export let onSelect: (path: string, value: unknown) => void = () => {};
  export let selectedPath: string = '';
  export let _path: string = '$';

  type Entry = { key: string | number; value: unknown; path: string };

  function isComplex(v: unknown): boolean {
    return v !== null && typeof v === 'object';
  }

  function formatValue(v: unknown): string {
    if (typeof v === 'string') return `"${v}"`;
    if (v === null) return 'null';
    return String(v);
  }

  function getEntries(d: unknown): Entry[] {
    if (d === null || d === undefined) return [];
    if (Array.isArray(d)) {
      return (d as unknown[]).map((v, i) => ({
        key: i,
        value: v,
        path: `${_path}[${i}]`,
      }));
    }
    if (typeof d === 'object') {
      return Object.entries(d as Record<string, unknown>).map(([k, v]) => ({
        key: k,
        value: v,
        path: `${_path}.${k}`,
      }));
    }
    return [];
  }

  function initExpanded(d: unknown): Record<string, boolean> {
    if (!d || typeof d !== 'object') return {};
    const keys = Array.isArray(d)
      ? (d as unknown[]).map((_, i) => String(i))
      : Object.keys(d as object);
    return Object.fromEntries(keys.map((k) => [k, true]));
  }

  $: entries = getEntries(data);
  let expanded: Record<string, boolean> = initExpanded(data);

  function toggleExpanded(key: string | number) {
    const k = String(key);
    expanded[k] = !expanded[k];
    expanded = { ...expanded };
  }
</script>

{#if data === null && _path === '$'}
  <p>No data</p>
{:else}
  {#each entries as entry (entry.key)}
    <div data-node data-selected={entry.path === selectedPath ? 'true' : 'false'}>
      <span>{entry.key}</span>
      {#if isComplex(entry.value)}
        <button
          type="button"
          aria-label="toggle {entry.key}"
          on:click={() => toggleExpanded(entry.key)}
        >
          {expanded[String(entry.key)] ? '▼' : '►'}
        </button>
        {#if expanded[String(entry.key)]}
          <svelte:self
            data={entry.value}
            {onSelect}
            {selectedPath}
            _path={entry.path}
          />
        {/if}
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <span on:click={() => onSelect(entry.path, entry.value)}>
          {formatValue(entry.value)}
        </span>
      {/if}
    </div>
  {/each}
{/if}
