<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getNextPhotoIndex } from '@lensing/core';

  export let photoPaths: string[] = [];
  export let cycleInterval: number = 8000;

  const KEN_BURNS_VARIANTS = ['ken-burns-1', 'ken-burns-2', 'ken-burns-3'];

  let currentIndex = 0;
  let variantIndex = 0;
  let currentVariant = KEN_BURNS_VARIANTS[0];
  let timer: ReturnType<typeof setInterval> | null = null;

  function advance() {
    if (photoPaths.length === 0) return;
    currentIndex = getNextPhotoIndex(currentIndex, photoPaths.length);
    variantIndex = (variantIndex + 1) % KEN_BURNS_VARIANTS.length;
    currentVariant = KEN_BURNS_VARIANTS[variantIndex];
  }

  onMount(() => {
    if (photoPaths.length > 1) {
      timer = setInterval(advance, cycleInterval);
    }
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });

  $: currentPhoto = photoPaths.length > 0 ? photoPaths[currentIndex] : null;
</script>

<div class="photo-slideshow">
  {#if currentPhoto}
    <div class="photo-slideshow__slide photo-slideshow__slide--active {currentVariant}">
      <img
        src={currentPhoto}
        alt="Ambient photo"
        style="object-fit: cover; position: absolute; inset: 0;"
      />
    </div>
  {:else}
    <div class="photo-slideshow__empty">
      <span>No photos available</span>
    </div>
  {/if}
</div>

<style>
  .photo-slideshow {
    position: relative;
    overflow: hidden;
    background: var(--void, hsl(240, 8%, 4%));
    border-radius: var(--radius-xl, 16px);
    inset: 0;
  }

  .photo-slideshow__slide {
    position: absolute;
    inset: 0;
    will-change: transform, opacity;
    transform-origin: center center;
  }

  .photo-slideshow__empty {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
