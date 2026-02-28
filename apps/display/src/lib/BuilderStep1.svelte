<script lang="ts">
  export let icons: Array<{ id: string; label: string; icon: string }> = [];
  export let onNext: (meta: Metadata) => void = () => {};
  export let onSelect: (meta: Metadata) => void = () => {};

  type Metadata = {
    name: string;
    description: string;
    category: string;
    icon: string;
    id: string;
  };

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

  let name = '';
  let description = '';
  let category = '';
  let selectedIcon = '';

  function slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  $: pluginId = slugify(name);
  $: isValid =
    pluginId !== '' && description.trim() !== '' && category !== '';

  function setName(e: Event) {
    name = (e.target as HTMLInputElement).value;
  }

  function setDescription(e: Event) {
    description = (e.target as HTMLTextAreaElement).value;
  }

  function setCategory(e: Event) {
    category = (e.target as HTMLSelectElement).value;
  }

  function handleIconClick(iconId: string) {
    selectedIcon = iconId;
    onSelect({ name, description, category, icon: iconId, id: pluginId });
  }

  function handleNext() {
    onNext({ name, description, category, icon: selectedIcon, id: pluginId });
  }
</script>

<form on:submit|preventDefault>
  <label for="plugin-name">Plugin Name</label>
  <input
    id="plugin-name"
    type="text"
    required
    value={name}
    on:input={setName}
    on:change={setName}
  />

  <label for="plugin-description">Description</label>
  <textarea
    id="plugin-description"
    required
    value={description}
    on:input={setDescription}
    on:change={setDescription}
  ></textarea>

  <label for="plugin-category">Category</label>
  <select id="plugin-category" required on:change={setCategory}>
    <option value="">Select a category</option>
    {#each CATEGORIES as cat (cat.value)}
      <option value={cat.value}>{cat.label}</option>
    {/each}
  </select>

  <div>
    <span>Icon</span>
    <div>
      {#each icons as icon (icon.id)}
        <button
          type="button"
          aria-pressed={selectedIcon === icon.id ? 'true' : 'false'}
          on:click={() => handleIconClick(icon.id)}
        >
          <span>{icon.icon}</span>
          <span>{icon.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <label for="plugin-id">Plugin ID</label>
  <input id="plugin-id" type="text" disabled bind:value={pluginId} />

  <button type="button" disabled={!isValid} on:click={handleNext}>Next</button>
</form>
