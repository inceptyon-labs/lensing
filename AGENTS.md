# Lensing

> Tool-agnostic project guidance. Read by any AGENTS.md-compatible agent.

A modern, plugin-driven personal information dashboard built on SvelteKit.

## Architecture diagram

`docs/architecture.json` is the Archify spec for the system overview
(host pollers, data bus, WebSocket path to the kiosk display, REST and SQLite,
trust boundaries, external data and AI services), with file:line sources pinned
to a commit. If a change adds, removes, or rewires a top-level component,
external service, trust boundary, or the deploy shape, update the spec after
committing it: re-pin `meta.repository.revision` to that commit, fix the
affected nodes, edges, and sources, re-render with the `archify` skill
(`finalize ... --repo-root .`), and commit the spec. Internal refactors and
shifted line numbers don't need it. Rendered HTML goes in `.archify/`
(gitignored).
