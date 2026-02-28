<script lang="ts">
  export let onSelect: (type: string) => void = () => {};
  export let selected: string = '';

  const types = [
    { id: 'json_api', label: 'JSON API', description: 'Fetch data from a JSON REST API endpoint' },
    { id: 'rss_feed', label: 'RSS Feed', description: 'Subscribe to an RSS or Atom feed' },
    {
      id: 'static_data',
      label: 'Static Data',
      description: 'Define fixed data without an external source',
    },
  ];
</script>

{#each types as type (type.id)}
  <button
    aria-selected={selected === type.id ? 'true' : 'false'}
    on:click={() => onSelect(type.id)}
  >
    <span>{type.label}</span>
    <span>{type.description}</span>
  </button>
{/each}
