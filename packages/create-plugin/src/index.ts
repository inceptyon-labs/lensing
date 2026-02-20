/**
 * @lensing/create-plugin
 *
 * Starter plugin template for Lensing — a fully-documented reference
 * implementation showing how to build a Lensing plugin with:
 *
 *   - plugin.json  — manifest declaring id, version, permissions, entry points
 *   - widget.svelte — Svelte 5 UI component with sample rendering patterns
 *   - server.ts     — Node.js server module with lifecycle hooks and request handling
 *   - __tests__/    — Test harness with sample data payloads and assertions
 *
 * SDK Quick Reference:
 *
 *   1. Edit plugin.json with your plugin's id, name, and permissions.
 *   2. Implement server.ts — initialize(), handleRequest(), onActivate(), onDeactivate().
 *   3. Edit widget.svelte — render the data from your server module via props.
 *   4. Add tests in __tests__/plugin.test.ts with sample payloads.
 *   5. Run `pnpm test` to verify everything works.
 *   6. Run `lensing dev` to preview in the live dashboard.
 *
 * @example
 *   // In your plugin project:
 *   import { initialize, handleRequest } from '@lensing/create-plugin/server';
 *   // Then customize the exported functions for your use case.
 */

// ── Server module exports ──────────────────────────────────────────────────

export { initialize, handleRequest, onActivate, onDeactivate } from './server.js';

// ── Type exports ───────────────────────────────────────────────────────────

export type { ServerConfig, RequestPayload, RequestResult, PluginManifest } from './server.js';

// ── Manifest export ────────────────────────────────────────────────────────

// The manifest object for programmatic access (e.g., in tests or tooling)
import manifest from './plugin.json' assert { type: 'json' };
export { manifest };
