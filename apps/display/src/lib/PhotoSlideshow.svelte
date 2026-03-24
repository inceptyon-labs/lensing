<script lang="ts">
  function getNextPhotoIndex(current: number, total: number): number {
    if (total <= 1) return 0;
    return (current + 1) % total;
  }

  interface Props {
    photoPaths?: string[];
    cycleInterval?: number;
  }

  const { photoPaths = [], cycleInterval = 30000 }: Props = $props();

  const KEN_BURNS_VARIANTS = ['ken-burns-1', 'ken-burns-2', 'ken-burns-3'];

  let currentIndex = $state(0);
  let variantIndex = $state(0);
  let currentVariant = $derived(KEN_BURNS_VARIANTS[variantIndex]);

  function advance() {
    const paths = photoPaths ?? [];
    if (paths.length === 0) return;
    currentIndex = getNextPhotoIndex(currentIndex, paths.length);
    variantIndex = (variantIndex + 1) % KEN_BURNS_VARIANTS.length;
  }

  // Start slideshow timer — recreate when cycleInterval or photoPaths change
  $effect(() => {
    const paths = photoPaths ?? [];
    const interval = cycleInterval ?? 30000;
    if (paths.length <= 1) return;

    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  });

  let currentPhoto = $derived(
    (photoPaths ?? []).length > 0 ? (photoPaths ?? [])[currentIndex] ?? null : null
  );
</script>

<div class="photo-slideshow">
  {#if currentPhoto}
    <div class="photo-slideshow__slide photo-slideshow__slide--active {currentVariant}">
      <img
        src={currentPhoto}
        alt="Ambient slideshow"
        style="object-fit: cover; position: absolute; inset: 0; width: 100%; height: 100%;"
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
    border: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
    box-shadow:
      inset 0 0 0 1px hsla(0, 0%, 100%, 0.04),
      0 2px 16px hsla(0, 0%, 0%, 0.4);
    width: 100%;
    height: 100%;
  }

  /* Soft vignette overlay to feather the edges */
  .photo-slideshow::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 40px 8px var(--void, hsl(240, 8%, 4%));
    pointer-events: none;
    z-index: 1;
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
