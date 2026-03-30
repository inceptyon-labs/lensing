import http from 'node:http';
import type { ZoneConfig, ConversationEntry, PluginAdminEntry, ZoneName, DisplayCapabilities, DisplaySettings, RotationValue, MarketplacePlugin, MarketplaceCategory, MarketplaceListResponse } from '@lensing/types';
/** Log entry emitted after each request */
export interface LogEntry {
    method: string;
    path: string;
    status: number;
    duration_ms: number;
}
/** Callbacks supplying data from storage */
export interface RestServerHandlers {
    getSettings: () => Promise<Record<string, unknown>>;
    putSettings: (settings: Record<string, unknown>) => Promise<void>;
    getLayout: () => Promise<ZoneConfig[]>;
    putLayout: (layout: ZoneConfig[]) => Promise<void>;
    postAsk: (question: string) => Promise<ConversationEntry>;
    getMarketplaceSettings?: () => Promise<{
        marketplaceRepoUrl: string;
        hasToken: boolean;
    } | undefined>;
    setMarketplaceSettings?: (settings: {
        gitHubToken: string;
        marketplaceRepoUrl: string;
    }) => Promise<void>;
    getMarketplacePlugins?: (params?: Record<string, string>) => Promise<MarketplaceListResponse>;
    getMarketplacePlugin?: (id: string) => Promise<MarketplacePlugin | undefined>;
    getMarketplaceCategories?: () => Promise<MarketplaceCategory[]>;
    installMarketplacePlugin?: (id: string) => Promise<PluginAdminEntry>;
    getMarketplaceUpdates?: () => Promise<import('./marketplace-updates').MarketplaceUpdateInfo[]>;
    updateMarketplacePlugin?: (id: string) => Promise<PluginAdminEntry>;
    getPlugins?: () => Promise<PluginAdminEntry[]>;
    getPlugin?: (id: string) => Promise<PluginAdminEntry | undefined>;
    getPluginTemplate?: (id: string) => Promise<{
        html: string;
        css: string;
    } | undefined>;
    getPluginSource?: (id: string) => Promise<{
        html: string;
        css: string;
        connector?: {
            type: string;
            url: string;
            method?: string;
            headers?: Record<string, string>;
            refreshInterval?: number;
        };
    } | undefined>;
    setPluginEnabled?: (id: string, enabled: boolean) => Promise<void>;
    updatePluginConfig?: (id: string, config: Record<string, unknown>) => Promise<void>;
    assignPluginZone?: (id: string, zone: ZoneName | undefined) => Promise<void>;
    reloadPlugins?: () => Promise<void>;
    installPlugin?: (zipBuffer: Buffer) => Promise<PluginAdminEntry>;
    saveBuiltPlugin?: (input: import('./plugin-save').BuilderSaveInput) => Promise<PluginAdminEntry>;
    restartModule?: (id: string) => Promise<{
        ok: boolean;
        running: boolean;
    }>;
    /** Sync running modules with current grid layout widget IDs */
    syncModules?: (layoutIds: string[]) => void;
    getDisplayCapabilities?: () => Promise<DisplayCapabilities>;
    getDisplaySettings?: () => Promise<DisplaySettings>;
    setDisplayBrightness?: (value: number) => Promise<void>;
    setDisplayRotation?: (value: RotationValue, persistent?: boolean) => Promise<void>;
    setDisplayContrast?: (value: number) => Promise<void>;
    testConnector?: (config: import('./connector-proxy').ConnectorTestConfig) => Promise<import('./connector-proxy').ConnectorTestResult>;
    aiAssist?: (input: import('@lensing/types').AiAssistRequest) => Promise<import('@lensing/types').AiAssistResponse>;
    listAiModels?: (provider: import('@lensing/types').AiProviderId) => Promise<Array<{
        id: string;
        name: string;
    }>>;
    getPluginSecretNames?: (id: string) => Promise<string[]>;
    setPluginSecret?: (id: string, key: string, value: string) => Promise<void>;
    deletePluginSecret?: (id: string, key: string) => Promise<void>;
    deletePlugin?: (id: string) => Promise<void>;
    getDataBusSnapshot?: () => Promise<Array<{
        channel: string;
        plugin_id: string;
        data: unknown;
        timestamp: string;
    }>>;
}
/** Configuration options for the REST server */
export interface RestServerOptions {
    /** Port to listen on. Defaults to 0 (OS-assigned) */
    port?: number;
    /** Allowed CORS origins. Defaults to ['*'] (wildcard) */
    corsOrigins?: string[];
    /** Structured log callback. Receives one entry per request */
    logger?: (entry: LogEntry) => void;
    /** Directory to serve static photos from at /photos/*. Can be a string or a getter function. */
    photoDir?: string | (() => string | undefined);
    /** Directory containing pre-built static files (SPA) to serve as fallback */
    staticDir?: string;
    /** Bearer token required for protected routes. If omitted, auth is disabled. */
    authToken?: string;
    /** Network address to bind to. Defaults to '127.0.0.1' */
    bindAddress?: string;
}
/** Public interface returned by createRestServer */
export interface RestServerInstance {
    /** Resolves when the server is listening */
    ready(): Promise<void>;
    /** Actual bound port (available after ready resolves) */
    readonly port: number;
    /** The underlying Node.js HTTP server (for attaching WebSocket, etc.) */
    readonly server: http.Server;
    /** Gracefully close the server */
    close(): Promise<void>;
}
export declare function createRestServer(handlers: RestServerHandlers, options?: RestServerOptions): RestServerInstance;
//# sourceMappingURL=rest-server.d.ts.map