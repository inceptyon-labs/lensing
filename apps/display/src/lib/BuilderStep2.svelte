<script lang="ts">
  import ConnectorTypePicker from './ConnectorTypePicker.svelte';

  let selectedType = '';
  let method = 'GET';
  let refreshInterval = 300;
  let headers = [{ key: '', value: '' }];

  const refreshDefaults: Record<string, number> = {
    json_api: 300,
    rss_feed: 1800,
    static_data: 3600,
  };

  function handleTypeSelect(type: string) {
    selectedType = type;
    refreshInterval = refreshDefaults[type] ?? 300;
  }
</script>

<ConnectorTypePicker onSelect={handleTypeSelect} selected={selectedType} />

{#if selectedType}
  <div>
    <label for="refresh-interval">Refresh Interval</label>
    <input id="refresh-interval" type="number" bind:value={refreshInterval} />
  </div>

  <button type="button">Test Connection</button>

  {#if selectedType === 'json_api'}
    <div>
      <label for="api-url">URL</label>
      <input id="api-url" type="url" />
    </div>

    <div>
      <label for="api-method">Method</label>
      <select id="api-method" bind:value={method}>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
    </div>

    <div>
      <span>Headers</span>
      {#each headers as header}
        <input bind:value={header.key} placeholder="Header Name" />
        <input bind:value={header.value} placeholder="Header Value" />
      {/each}
    </div>

    <div>
      <label for="auth-token">Auth Token</label>
      <input id="auth-token" type="text" />
    </div>
  {:else if selectedType === 'rss_feed'}
    <div>
      <label for="feed-url">Feed URL</label>
      <input id="feed-url" type="url" />
    </div>
  {:else if selectedType === 'static_data'}
    <div>
      <span>Key</span>
      <span>Value</span>
    </div>
  {/if}
{/if}
