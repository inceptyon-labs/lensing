<script lang="ts">
  import type { CalendarEvent } from '@lensing/types';

  export let events: CalendarEvent[] = [];
  export let compact: boolean = false;

  interface DayGroup {
    label: string;
    events: CalendarEvent[];
  }

  function formatTime(isoStr: string): string {
    const date = new Date(isoStr);
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }

  function getDayLabel(isoStr: string): string {
    const date = new Date(isoStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const toDateStr = (d: Date) =>
      d.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

    if (toDateStr(date) === toDateStr(today)) return 'Today';
    if (toDateStr(date) === toDateStr(tomorrow)) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  }

  function getUpcoming(evts: CalendarEvent[], limit: number): CalendarEvent[] {
    const now = Date.now();
    return evts
      .filter((e) => new Date(e.end).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, limit);
  }

  function groupByDay(evts: CalendarEvent[]): DayGroup[] {
    const now = Date.now();
    const upcoming = evts
      .filter((e) => new Date(e.end).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const groups = new Map<string, CalendarEvent[]>();
    for (const evt of upcoming) {
      const label = getDayLabel(evt.start);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label)!.push(evt);
    }

    return Array.from(groups.entries()).map(([label, evts]) => ({ label, events: evts }));
  }

  $: compactEvents = getUpcoming(events, 5);
  $: dayGroups = groupByDay(events);
</script>

<div class="calendar-widget" class:calendar-widget--compact={compact}>
  {#if events.length === 0}
    <div class="calendar-widget__empty">
      <span>No calendar events</span>
    </div>
  {:else if compact}
    <ul class="calendar-widget__compact-list">
      {#each compactEvents as evt (evt.id)}
        <li class="calendar-widget__compact-item">
          {#if evt.allDay}
            <span class="calendar-widget__compact-time calendar-widget__compact-time--allday"
              >All Day</span
            >
          {:else}
            <span class="calendar-widget__compact-time">{formatTime(evt.start)}</span>
          {/if}
          <span class="calendar-widget__compact-title">{evt.title}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="calendar-widget__groups">
      {#each dayGroups as group (group.label)}
        <div class="calendar-widget__day">
          <div class="calendar-widget__day-header">{group.label}</div>
          <ul class="calendar-widget__event-list">
            {#each group.events as evt (evt.id)}
              <li class="calendar-widget__event" class:calendar-widget__event--allday={evt.allDay}>
                <div class="calendar-widget__event-time">
                  {#if evt.allDay}
                    <span class="calendar-widget__allday-badge">All Day</span>
                  {:else}
                    {formatTime(evt.start)}
                  {/if}
                </div>
                <div class="calendar-widget__event-body">
                  <span class="calendar-widget__event-title">{evt.title}</span>
                  {#if evt.location}
                    <span class="calendar-widget__event-location">{evt.location}</span>
                  {/if}
                </div>
                {#if evt.color}
                  <span class="calendar-widget__event-dot" style="background:{evt.color}"></span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .calendar-widget {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
    font-variant-numeric: tabular-nums;
  }

  /* ── Day Groups ───────────────────────────────────────────────────────── */

  .calendar-widget__groups {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 16px);
  }

  .calendar-widget__day-header {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-semi, 600);
    color: var(--ember, hsl(28, 85%, 55%));
    letter-spacing: var(--tracking-wide, 0.04em);
    text-transform: uppercase;
    margin-bottom: var(--space-2, 8px);
  }

  /* ── Event List ───────────────────────────────────────────────────────── */

  .calendar-widget__event-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .calendar-widget__event {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3, 12px);
    padding-bottom: var(--space-2, 8px);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .calendar-widget__event:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .calendar-widget__event-time {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    width: 5rem;
    flex-shrink: 0;
    padding-top: 1px;
  }

  .calendar-widget__allday-badge {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--ember, hsl(28, 85%, 55%));
    background: var(--ember-glow, hsla(28, 85%, 55%, 0.12));
    border-radius: 4px;
    padding: 1px 6px;
  }

  .calendar-widget__event-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .calendar-widget__event-title {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-medium, 500);
    color: var(--starlight, hsl(220, 15%, 90%));
    line-height: var(--leading-tight, 1.2);
  }

  .calendar-widget__event-location {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .calendar-widget__event-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* ── Compact mode ─────────────────────────────────────────────────────── */

  .calendar-widget__compact-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
  }

  .calendar-widget__compact-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-3, 12px);
  }

  .calendar-widget__compact-time {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    width: 5rem;
    flex-shrink: 0;
  }

  .calendar-widget__compact-time--allday {
    color: var(--ember, hsl(28, 85%, 55%));
    font-weight: var(--weight-medium, 500);
  }

  .calendar-widget__compact-title {
    font-size: var(--text-sm, 0.875rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  /* ── Empty state ──────────────────────────────────────────────────────── */

  .calendar-widget__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
