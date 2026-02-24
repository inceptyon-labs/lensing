---
# lensing-35n4
title: Photo slideshow data pipeline
status: todo
type: task
priority: normal
created_at: 2026-02-24T18:00:49Z
updated_at: 2026-02-24T18:00:49Z
parent: lensing-wbum
---

PhotoSlideshow component exists and is wired in PluginRenderer, but always receives photoPaths=[]. The server-side discoverPhotos() can scan directories for images but there's no way to get that data to the client.

## Current State
- PhotoSlideshow.svelte exists and works if given photo paths
- PluginRenderer: <PhotoSlideshow photoPaths={[]} /> — always empty
- Server: packages/core/src/plugins/photo-slideshow/index.ts has discoverPhotos()
- No REST endpoint exposes discovered photos
- No data bus channel for photo paths

## What to Do
- Option A: REST endpoint GET /photos that returns discovered photo paths, PluginRenderer fetches on mount
- Option B: Publish photo paths to data bus channel 'photos.paths', use data bus store
- Either way, serve the actual image files via a static file route
- Update PluginRenderer to pass real paths

## Key Files
- packages/core/src/plugins/photo-slideshow/index.ts
- apps/display/src/lib/PhotoSlideshow.svelte
- apps/display/src/lib/PluginRenderer.svelte
- packages/core/src/rest-server.ts (if adding REST endpoint)
