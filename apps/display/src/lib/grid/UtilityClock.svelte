<script lang="ts">
  let now = $state(new Date());

  $effect(() => {
    const id = setInterval(() => {
      now = new Date();
    }, 1000);
    return () => clearInterval(id);
  });

  let time = $derived(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  let seconds = $derived(now.toLocaleTimeString([], { second: '2-digit' }).slice(-2));
  let date = $derived(
    now.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  );
</script>

<div class="util-clock">
  <span class="util-clock__time">
    {time}<span class="util-clock__seconds">{seconds}</span>
  </span>
  <span class="util-clock__date">{date}</span>
</div>

<style>
  .util-clock {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 2px;
    user-select: none;
  }

  .util-clock__time {
    font-size: 2rem;
    font-weight: 700;
    color: hsl(220, 15%, 90%);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    line-height: 1;
  }

  .util-clock__seconds {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(220, 10%, 62%);
    margin-left: 2px;
    vertical-align: super;
  }

  .util-clock__date {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(220, 10%, 62%);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
</style>
