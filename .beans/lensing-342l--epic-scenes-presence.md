---
# lensing-342l
title: 'Epic: Scenes + Presence'
status: todo
type: epic
priority: normal
tags:
  - pasiv
  - priority:medium
created_at: 2026-02-16T21:19:30Z
updated_at: 2026-02-16T21:19:30Z
---

Display modes, scene scheduling, presence detection, photo ambient plugin, and Home Assistant integration.

## Vision

The display adapts to context — time of day, user presence, and upcoming events. Scenes shift the UI from information-dense morning mode to ambient photo frame at night.

## Features

- Display modes (scenes) with transitions
- Scene scheduler (time-based triggers)
- Presence detection (PIR sensor GPIO)
- Photo/art ambient plugin
- Home Assistant plugin

## Success Criteria

- [ ] Scenes switch by time-of-day schedule
- [ ] Presence detection wakes/sleeps the display
- [ ] Photo ambient plugin cycles images with Ken Burns effect
- [ ] Home Assistant plugin shows device states
- [ ] Manual scene switching from admin UI and CLI
