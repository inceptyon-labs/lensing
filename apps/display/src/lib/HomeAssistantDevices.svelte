<script lang="ts">
  import type { HassEntity } from '@lensing/types';

  export let devices: HassEntity[] = [];
  export let sensors: HassEntity[] = [];

  $: lights = devices.filter((d) => d.domain === 'light');
  $: switches = devices.filter((d) => d.domain === 'switch');
  $: locks = devices.filter((d) => d.domain === 'lock');
  $: climate = devices.filter((d) => d.domain === 'climate');

  function stateLabel(entity: HassEntity): string {
    return entity.state.charAt(0).toUpperCase() + entity.state.slice(1);
  }

  function isActive(entity: HassEntity): boolean {
    return entity.state === 'on' || entity.state === 'unlocked' || entity.state === 'open';
  }

  function isWarning(entity: HassEntity): boolean {
    return entity.state === 'unlocked' || entity.state === 'open';
  }

  function tempDisplay(entity: HassEntity): string {
    const current = entity.attributes.current_temperature;
    const target = entity.attributes.temperature;
    if (current !== undefined && target !== undefined) {
      return `${current}° / ${target}°`;
    }
    return stateLabel(entity);
  }
</script>

<div class="ha-devices">
  {#if devices.length === 0 && sensors.length === 0}
    <div class="ha-devices__empty">
      <span>No devices available</span>
    </div>
  {:else}
    {#if lights.length > 0}
      <section class="ha-devices__group">
        <h3 class="ha-devices__group-label">Lights</h3>
        <ul class="ha-devices__list">
          {#each lights as entity (entity.entity_id)}
            <li
              class="ha-devices__item"
              class:ha-devices__item--active={isActive(entity)}
              class:ha-devices__item--warning={isWarning(entity)}
            >
              <span class="ha-devices__name"
                >{entity.friendly_name}</span
              >
              <span
                class="ha-devices__state"
                class:ha-devices__state--on={entity.state === 'on'}
                class:ha-devices__state--off={entity.state === 'off'}>{stateLabel(entity)}</span
              >
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if switches.length > 0}
      <section class="ha-devices__group">
        <h3 class="ha-devices__group-label">Switches</h3>
        <ul class="ha-devices__list">
          {#each switches as entity (entity.entity_id)}
            <li
              class="ha-devices__item"
              class:ha-devices__item--active={isActive(entity)}
              class:ha-devices__item--warning={isWarning(entity)}
            >
              <span class="ha-devices__name"
                >{entity.friendly_name}</span
              >
              <span
                class="ha-devices__state"
                class:ha-devices__state--on={entity.state === 'on'}
                class:ha-devices__state--off={entity.state === 'off'}>{stateLabel(entity)}</span
              >
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if locks.length > 0}
      <section class="ha-devices__group">
        <h3 class="ha-devices__group-label">Locks</h3>
        <ul class="ha-devices__list">
          {#each locks as entity (entity.entity_id)}
            <li
              class="ha-devices__item"
              class:ha-devices__item--active={isActive(entity)}
              class:ha-devices__item--warning={isWarning(entity)}
            >
              <span class="ha-devices__name"
                >{entity.friendly_name}</span
              >
              <span
                class="ha-devices__state"
                class:ha-devices__state--locked={entity.state === 'locked'}
                class:ha-devices__state--warning={isWarning(entity)}>{stateLabel(entity)}</span
              >
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if climate.length > 0}
      <section class="ha-devices__group">
        <h3 class="ha-devices__group-label">Climate</h3>
        <ul class="ha-devices__list">
          {#each climate as entity (entity.entity_id)}
            <li class="ha-devices__item">
              <span class="ha-devices__name"
                >{entity.friendly_name}</span
              >
              <span class="ha-devices__state ha-devices__state--climate">{tempDisplay(entity)}</span
              >
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if sensors.length > 0}
      <section class="ha-devices__group">
        <h3 class="ha-devices__group-label">Sensors</h3>
        <ul class="ha-devices__list">
          {#each sensors as entity (entity.entity_id)}
            <li class="ha-devices__item">
              <span class="ha-devices__name"
                >{entity.friendly_name}</span
              >
              <span class="ha-devices__state ha-devices__state--sensor">
                {entity.state}{entity.attributes.unit_of_measurement
                  ? ` ${entity.attributes.unit_of_measurement}`
                  : ''}
              </span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/if}
</div>

<style>
  .ha-devices {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 16px);
  }

  .ha-devices__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }

  .ha-devices__group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .ha-devices__group-label {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--dim-light, hsl(220, 10%, 62%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
    margin: 0;
  }

  .ha-devices__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
  }

  .ha-devices__item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-2, 8px);
    padding: var(--space-2, 8px) 0;
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .ha-devices__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .ha-devices__item--active {
    border-left: 2px solid var(--ember, hsl(28, 85%, 55%));
    padding-left: var(--space-2, 8px);
  }

  .ha-devices__item--warning {
    border-left: 2px solid var(--alert-warning, hsl(38, 65%, 50%));
    padding-left: var(--space-2, 8px);
  }

  .ha-devices__name {
    font-size: var(--text-base, 1rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ha-devices__state {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--dim-light, hsl(220, 10%, 62%));
    white-space: nowrap;
  }

  .ha-devices__state--on {
    color: var(--ember, hsl(28, 85%, 55%));
  }

  .ha-devices__state--off {
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .ha-devices__state--locked {
    color: var(--faint-light, hsl(220, 10%, 45%));
  }

  .ha-devices__state--warning {
    color: var(--alert-warning, hsl(38, 65%, 50%));
  }

  .ha-devices__state--climate {
    color: var(--starlight, hsl(220, 15%, 90%));
    font-weight: var(--weight-bold, 700);
  }

  .ha-devices__state--sensor {
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-variant-numeric: tabular-nums;
  }
</style>
