/**
 * Starter Plugin — Server Module
 *
 * The server module runs in the Lensing core process, not in the browser.
 * It handles data fetching, secret management, and heavy computation on
 * behalf of the widget. The widget calls into this module via the plugin SDK.
 *
 * SDK Convention: Export named async functions. The plugin loader discovers
 * and wraps them. You do NOT need to call initialize() yourself — the runtime
 * calls it when the plugin is first loaded.
 *
 * Lifecycle:
 *   1. initialize(config)  — called once on plugin load
 *   2. handleRequest(payload) — called whenever the widget needs data
 *   3. onActivate()  — called when plugin becomes visible/active
 *   4. onDeactivate() — called when plugin is hidden or disabled
 */
import type { PluginManifest } from '@lensing/types';
/**
 * ServerConfig is injected by the runtime when initialize() is called.
 *
 * Secrets declared in plugin.json ["permissions"]["secrets"] are available
 * as process.env.PLUGIN_<SECRET_NAME> — never pass secrets to the widget.
 *
 * Example plugin.json entry:
 *   "permissions": { "secrets": ["API_KEY"] }
 *
 * Then access via: process.env.PLUGIN_API_KEY
 */
export type ServerConfig = {
    /** API key for the external service (from secrets config) */
    apiKey: string;
    /** Optional API secret for signed requests */
    apiSecret?: string;
    /** Base URL for API calls (must be in allowed_domains) */
    endpoint: string;
};
/**
 * Request payload sent from the widget to the server.
 *
 * Example widget call:
 *   const data = await sdk.request({ action: 'fetch-data', data: { id: 42 } });
 */
export type RequestPayload = {
    /** What the widget wants the server to do */
    action: string;
    /** Action-specific parameters — keep this serializable (no functions/classes) */
    data?: unknown;
};
/**
 * Standard response returned from handleRequest().
 *
 * Always set success=false and include an error message on failure so the
 * widget can display a friendly error state.
 */
export type RequestResult = {
    success: boolean;
    data?: unknown;
    error?: string;
};
/**
 * Initialize the plugin with its runtime configuration.
 *
 * Called ONCE by the Lensing runtime when the plugin is loaded. Use this to:
 * - Validate required config values
 * - Set up API clients, database connections, or caches
 * - Warm up any expensive resources
 *
 * Throw an Error to abort loading — the plugin will enter an error state
 * and the dashboard will show a configuration error message.
 *
 * @param config - Injected configuration (apiKey, endpoint, etc.)
 * @returns Promise resolving to { ready: true } on success
 * @throws Error if required config is missing or invalid
 *
 * Example:
 *   const result = await initialize({ apiKey: '...', endpoint: 'https://api.example.com' });
 *   // result.ready === true
 */
export declare function initialize(config: ServerConfig): Promise<{
    ready: boolean;
}>;
/**
 * Handle a request from the widget.
 *
 * The widget calls sdk.request(payload) → runtime routes to this function.
 * Add a case for each action your widget needs. Return structured data that
 * the widget can render directly.
 *
 * SDK Convention: Keep actions fine-grained. One action per widget use case.
 * Never return raw external API responses — transform to your own shape.
 *
 * Rate limiting: The runtime enforces max_refresh_ms and max_request_burst
 * from plugin.json permissions. Calls beyond the burst limit are queued.
 *
 * @param payload - Action name + optional parameters from the widget
 * @returns Promise resolving to { success, data?, error? }
 *
 * Example payloads:
 *   { action: 'fetch-data', data: { id: 42 } }
 *   { action: 'refresh' }
 */
export declare function handleRequest(payload: RequestPayload): Promise<RequestResult>;
/**
 * Called when the plugin widget becomes visible or active.
 *
 * Use this to:
 * - Start polling or real-time subscriptions
 * - Prefetch data the widget will likely need
 * - Resume paused operations
 *
 * @returns Promise resolving to { status: 'active' }
 */
export declare function onActivate(): Promise<{
    status: string;
}>;
/**
 * Called when the plugin widget is hidden or disabled.
 *
 * Use this to:
 * - Stop polling or cancel subscriptions to save resources
 * - Flush pending writes
 * - Release held locks
 *
 * @returns Promise resolving to { status: 'inactive' }
 */
export declare function onDeactivate(): Promise<{
    status: string;
}>;
export type { PluginManifest };
//# sourceMappingURL=server.d.ts.map