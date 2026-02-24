<script lang="ts">
  export let onInstalled: () => void = () => {};

  let error: string | null = null;
  let uploading = false;
  let dragOver = false;

  async function uploadFile(file: File) {
    if (!file.name.endsWith('.zip')) {
      error = 'Only .zip files are accepted';
      return;
    }
    error = null;
    uploading = true;

    try {
      const buffer = await file.arrayBuffer();
      // eslint-disable-next-line no-undef
      const res = await fetch('/plugins/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/zip' },
        body: buffer,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        error = data.error ?? `Server returned ${res.status}`;
      } else {
        onInstalled();
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Upload failed';
    } finally {
      uploading = false;
    }
  }

  // eslint-disable-next-line no-undef
  function handleFileInput(e: Event) {
    // eslint-disable-next-line no-undef
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) void uploadFile(file);
    input.value = '';
  }

  // eslint-disable-next-line no-undef
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) void uploadFile(file);
  }

  // eslint-disable-next-line no-undef
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }
</script>

<div
  class="upload-zone"
  class:upload-zone--drag={dragOver}
  class:upload-zone--uploading={uploading}
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  role="region"
  aria-label="Plugin upload"
>
  <label class="upload-label">
    <span class="upload-icon">+</span>
    <span class="upload-text">
      {#if uploading}
        Installing…
      {:else}
        Drop a .zip plugin here or <span class="upload-link">browse</span>
      {/if}
    </span>
    <input
      type="file"
      accept=".zip"
      class="upload-input"
      on:change={handleFileInput}
      disabled={uploading}
    />
  </label>

  {#if error}
    <p class="upload-error">{error}</p>
  {/if}
</div>

<style>
  .upload-zone {
    border: 2px dashed var(--edge);
    border-radius: var(--radius-md);
    padding: var(--space-6, 24px) var(--space-4);
    text-align: center;
    background-color: var(--void);
    transition: all var(--duration-fast) var(--ease-out);
    cursor: pointer;
  }

  .upload-zone--drag {
    border-color: var(--ember);
    background-color: color-mix(in srgb, var(--ember) 5%, var(--void));
  }

  .upload-zone--uploading {
    opacity: 0.6;
    pointer-events: none;
  }

  .upload-zone:hover {
    border-color: var(--edge-bright);
  }

  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
  }

  .upload-icon {
    font-size: var(--text-2xl, 1.5rem);
    color: var(--dim-light);
    line-height: 1;
  }

  .upload-text {
    font-size: var(--text-sm);
    color: var(--dim-light);
    font-family: var(--font-mono);
  }

  .upload-link {
    color: var(--ember);
    text-decoration: underline;
  }

  .upload-input {
    display: none;
  }

  .upload-error {
    margin: var(--space-2) 0 0;
    font-size: var(--text-xs);
    color: var(--nova);
    font-family: var(--font-mono);
  }
</style>
