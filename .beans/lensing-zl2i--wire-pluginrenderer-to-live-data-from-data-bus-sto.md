---
# lensing-zl2i
title: Wire PluginRenderer to live data from data bus store
status: todo
type: task
priority: critical
created_at: 2026-02-24T18:00:08Z
updated_at: 2026-02-24T18:01:07Z
parent: lensing-wbum
blocked_by:
  - lensing-gi9v
---

PluginRenderer currently passes hardcoded empty arrays to every widget component. It needs to read from the client-side data bus store and pass live data.

## Current State

```svelte
<NewsHeadlines headlines={[]} />
<SportsScores games={[]} />
<HomeAssistantDevices devices={[]} sensors={[]} />
<PhotoSlideshow photoPaths={[]} />
```

## What to Do

- Import the data bus store
- For each plugin_id, subscribe to the appropriate channel and pass data:
  - news → dataBus['news.headlines']?.articles → headlines prop
  - sports → dataBus['sports.scores']?.games → games prop
  - home-assistant → dataBus['home.devices'] + dataBus['home.sensors']
  - crypto → dataBus['crypto.prices'] → new CryptoWidget
  - weather → dataBus['weather.current'] → new WeatherWidget
  - etc.
- Handle the case where data hasn't arrived yet (loading state vs empty state)

## Blocked By

- lensing-gi9v (client-side data bus store)

## Key Files

- apps/display/src/lib/PluginRenderer.svelte
