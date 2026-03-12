<script lang="ts">
  export let data: number[] = [];
  export let width: number = 120;
  export let height: number = 32;
  export let positive: boolean = true;

  $: points = buildPath(data, width, height);

  function buildPath(values: number[], w: number, h: number): string {
    if (values.length < 2) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const padding = 1;
    const usableH = h - padding * 2;

    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = padding + usableH - ((v - min) / range) * usableH;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }
</script>

<svg
  class="sparkline"
  viewBox="0 0 {width} {height}"
  preserveAspectRatio="none"
  {width}
  {height}
>
  {#if points}
    <path
      d={points}
      fill="none"
      stroke={positive
        ? 'var(--alert-success, hsl(160, 45%, 45%))'
        : 'var(--alert-urgent, hsl(0, 60%, 55%))'}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  {/if}
</svg>

<style>
  .sparkline {
    display: block;
    overflow: visible;
  }
</style>
