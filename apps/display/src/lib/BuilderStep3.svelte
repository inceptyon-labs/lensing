<script lang="ts">
  import JsonTreeViewer from './JsonTreeViewer.svelte';

  export let sampleData: unknown = null;

  const slots = [
    { id: 'title', label: 'Title' },
    { id: 'value', label: 'Value' },
    { id: 'image', label: 'Image' },
    { id: 'subtitle', label: 'Subtitle' },
  ];

  let activeSlot: string | null = null;
  let mappings: Record<string, { path: string; value: unknown }> = {};

  function selectSlot(id: string) {
    activeSlot = id;
  }

  function handleFieldSelect(path: string, value: unknown) {
    if (activeSlot) {
      mappings[activeSlot] = { path, value };
      mappings = { ...mappings };
      activeSlot = null;
    }
  }

  function removeMapping(id: string) {
    const { [id]: _, ...rest } = mappings;
    mappings = rest;
  }

  $: hasMapping = Object.keys(mappings).length > 0;
  $: activeSlotPath = activeSlot ? (mappings[activeSlot]?.path ?? '') : '';
</script>

{#if sampleData === null}
  <p>No sample data</p>
{:else}
  <div>
    {#each slots as slot (slot.id)}
      <div>
        <span>{slot.label}</span>
        <button
          type="button"
          aria-pressed={activeSlot === slot.id ? 'true' : 'false'}
          on:click={() => selectSlot(slot.id)}
        >
          Map {slot.label}
        </button>
        {#if mappings[slot.id]}
          <button type="button" on:click={() => removeMapping(slot.id)}>
            Remove {slot.label}
          </button>
        {/if}
      </div>
    {/each}
  </div>

  <JsonTreeViewer data={sampleData} onSelect={handleFieldSelect} selectedPath={activeSlotPath} />

  <div data-testid="mapping-summary">
    {#each slots as slot (slot.id)}
      {#if mappings[slot.id]}
        <div>
          <span>{slot.label}</span>
          <span>{mappings[slot.id].path}</span>
          <span>{String(mappings[slot.id].value)}</span>
        </div>
      {/if}
    {/each}
  </div>

  <button type="button" disabled={!hasMapping}>Next</button>
{/if}
