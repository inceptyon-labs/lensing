<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { SportsGame } from '@lensing/types';

  export let games: SportsGame[] = [];
  export let compact: boolean = false;

  $: liveGames = games.filter((g) => g.status === 'in_progress');
  $: otherGames = games.filter((g) => g.status !== 'in_progress');
  $: displayedGames = [...liveGames, ...otherGames];

  let unsubscribe: (() => void) | null = null;

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function formatStatus(game: SportsGame): string {
    if (game.status === 'in_progress') return game.period || 'LIVE';
    if (game.status === 'final') return 'Final';
    if (game.status === 'scheduled') return formatStartTime(game.startTime);
    if (game.status === 'postponed') return 'PPD';
    if (game.status === 'cancelled') return 'Cancelled';
    return game.status;
  }

  function formatStartTime(startTime: number): string {
    const date = new Date(startTime);
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }
</script>

<div class="sports-scores" class:sports-scores--compact={compact}>
  {#if displayedGames.length === 0}
    <div class="sports-scores__empty">
      <span>No games available</span>
    </div>
  {:else if compact}
    <ul class="sports-scores__compact-list">
      {#each displayedGames as game (game.id)}
        <li class="sports-scores__compact-item">
          <span class="sports-scores__league-badge">{game.league.toUpperCase()}</span>
          {#if game.status === 'in_progress'}
            <span class="sports-scores__live-badge">LIVE</span>
          {/if}
          <span class="sports-scores__compact-matchup">
            {game.awayTeam} {game.awayScore} – {game.homeScore} {game.homeTeam}
          </span>
          <span class="sports-scores__compact-status">{formatStatus(game)}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <ul class="sports-scores__list">
      {#each displayedGames as game (game.id)}
        <li class="sports-scores__item" class:sports-scores__item--live={game.status === 'in_progress'}>
          <div class="sports-scores__header">
            <span class="sports-scores__league-badge">{game.league.toUpperCase()}</span>
            {#if game.status === 'in_progress'}
              <span class="sports-scores__live-badge">LIVE</span>
              {#if game.period}
                <span class="sports-scores__period">{game.period}</span>
              {/if}
            {:else}
              <span class="sports-scores__status">{formatStatus(game)}</span>
            {/if}
          </div>
          <div class="sports-scores__matchup">
            <div class="sports-scores__team">
              <span class="sports-scores__team-name">{game.awayTeam}</span>
              <span class="sports-scores__score">{game.awayScore}</span>
            </div>
            <div class="sports-scores__team">
              <span class="sports-scores__team-name">{game.homeTeam}</span>
              <span class="sports-scores__score">{game.homeScore}</span>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .sports-scores {
    background: var(--event-horizon, hsl(240, 6%, 7%));
    border-radius: var(--radius-md, 8px);
    padding: var(--space-4, 16px);
    box-shadow: 0 0 0 1px var(--edge, hsla(220, 10%, 50%, 0.12));
    color: var(--starlight, hsl(220, 15%, 90%));
  }

  .sports-scores__list,
  .sports-scores__compact-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 12px);
  }

  .sports-scores__item {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
    padding-bottom: var(--space-3, 12px);
    border-bottom: 1px solid var(--edge-soft, hsla(220, 10%, 50%, 0.07));
  }

  .sports-scores__item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .sports-scores__item--live {
    border-left: 2px solid var(--ember, hsl(28, 85%, 55%));
    padding-left: var(--space-3, 12px);
  }

  .sports-scores__header {
    display: flex;
    align-items: center;
    gap: var(--space-2, 8px);
  }

  .sports-scores__league-badge {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--dim-light, hsl(220, 10%, 62%));
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .sports-scores__live-badge {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--ember, hsl(28, 85%, 55%));
    letter-spacing: var(--tracking-wide, 0.04em);
  }

  .sports-scores__period,
  .sports-scores__status {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
  }

  .sports-scores__matchup {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 4px);
  }

  .sports-scores__team {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-2, 8px);
  }

  .sports-scores__team-name {
    font-size: var(--text-base, 1rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    flex: 1;
  }

  .sports-scores__score {
    font-size: var(--text-base, 1rem);
    font-weight: var(--weight-semi, 600);
    color: var(--starlight, hsl(220, 15%, 90%));
    font-variant-numeric: tabular-nums;
    min-width: 2ch;
    text-align: right;
  }

  /* Compact mode */
  .sports-scores__compact-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-2, 8px);
    overflow: hidden;
  }

  .sports-scores__compact-matchup {
    font-size: var(--text-sm, 0.875rem);
    color: var(--starlight, hsl(220, 15%, 90%));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .sports-scores__compact-status {
    font-size: var(--text-sm, 0.875rem);
    color: var(--dim-light, hsl(220, 10%, 62%));
    white-space: nowrap;
  }

  /* Empty state */
  .sports-scores__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-5, 24px);
    color: var(--dim-light, hsl(220, 10%, 62%));
    font-size: var(--text-sm, 0.875rem);
  }
</style>
