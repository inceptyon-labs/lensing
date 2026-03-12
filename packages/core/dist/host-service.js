import { createDatabase } from './database';
import { createPluginLoader } from './plugin-loader';
import { createDataBus } from './data-bus';
import { createRestServer } from './rest-server';
import { createWsServer } from './ws-server';
import { createPluginAdminHandlers } from './plugin-admin-handlers';
import { createNotificationQueue } from './notification-queue';
import { rebootModule, syncModulesWithLayout } from './module-boot';
import { createDisplayControl } from './display-control';
import { createDisplayHardware } from './display-hardware';
import { createAiProvider } from './ai-assist-providers';
import { createAiAssist } from './ai-assist';
import { createSecretStore } from './secret-store';
import { createConnectorRunner } from './connector-runner';
import { createPluginScheduler } from './plugin-scheduler';
import { validateSecretAccess } from './plugin-permissions';
import { MODULE_SCHEMAS, SYSTEM_MODULE_IDS } from '@lensing/types';
export function createHostService(options = {}) {
    const { port = 0, pluginsDir = './plugins', dbPath = ':memory:', logger, staticDir, gpioFactory, displayControl: enableDisplayControl, authToken, bindAddress, } = options;
    let _db;
    let _rest;
    let _ws;
    let _plugins;
    let _modules = [];
    let _notificationQueue;
    let _port = 0;
    let _dataBus;
    let _displayControl;
    let _displayHardware;
    let _secretStore;
    let _connectorRunner;
    // AI Assist: Load providers from env vars
    const aiProviders = new Map();
    const setupAiProviders = () => {
        const providerConfigs = [
            { env: 'ANTHROPIC_API_KEY', provider: 'anthropic' },
            { env: 'DEEPSEEK_API_KEY', provider: 'deepseek' },
            { env: 'GEMINI_API_KEY', provider: 'gemini' },
        ];
        for (const { env, provider } of providerConfigs) {
            const apiKey = process.env[env];
            if (apiKey && apiKey.trim()) {
                try {
                    aiProviders.set(provider, createAiProvider({ provider, apiKey }));
                    log.info(`AI provider configured: ${provider}`);
                }
                catch (err) {
                    // Log error without exposing API key
                    log.error(`Failed to configure ${provider} provider: ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
            }
        }
    };
    const log = {
        info: (msg, data) => logger?.info(msg, data),
        error: (msg, err) => logger?.error(msg, err),
    };
    const ready = (async () => {
        try {
            // 1. Database
            _db = createDatabase({ path: dbPath });
            log.info('Database ready');
            // 2. Secret store (uses DB for encrypted persistence)
            _secretStore = createSecretStore(_db);
            log.info('Secret store ready');
            // 3. AI Assist providers
            setupAiProviders();
            // 4. Data bus + connector runner (must be ready before plugin loader)
            const dataBus = createDataBus();
            _dataBus = dataBus;
            const scheduler = createPluginScheduler();
            _connectorRunner = createConnectorRunner({
                dataBus,
                scheduler,
                allowPrivate: true,
                secretResolver: async (pluginId, name) => {
                    const plugin = _plugins.getPlugin(pluginId);
                    if (plugin && !validateSecretAccess(name, plugin.manifest.permissions ?? {})) {
                        throw new Error(`Secret '${name}' not declared in plugin permissions`);
                    }
                    const value = _secretStore.get(pluginId, name);
                    if (value === undefined)
                        throw new Error(`Secret '${name}' not found`);
                    return value;
                },
            });
            log.info('Connector runner ready');
            // 5. Plugin loader (with connector runner so plugin connectors start on boot)
            _plugins = createPluginLoader({ pluginsDir, connectorRunner: _connectorRunner });
            await _plugins.load();
            log.info('Plugins loaded', { count: _plugins.getAllPlugins().length });
            // 5. Display hardware (probes available controls)
            _displayHardware = createDisplayHardware({ logger });
            // 6. REST server (wired to database + plugins)
            const pluginHandlers = createPluginAdminHandlers({
                pluginLoader: _plugins,
                db: _db,
                pluginsDir,
                connectorRunner: _connectorRunner,
                secretStore: _secretStore,
                onChange: (_pluginId, _action) => {
                    // Notify connected display clients so they re-fetch plugin data
                    _ws?.broadcast({
                        type: 'layout_change',
                        payload: null,
                        timestamp: new Date().toISOString(),
                    });
                },
            });
            // Create aiAssist handler if providers are configured
            const aiAssistHandler = aiProviders.size > 0
                ? async (input) => {
                    const provider = aiProviders.get(input.provider);
                    if (!provider) {
                        // Don't expose which providers are/aren't configured
                        throw new Error('AI provider is not available');
                    }
                    const assist = createAiAssist({ provider, model: input.model });
                    return assist.generate({
                        docsText: input.docsTextOrUrl,
                        pluginContext: input.pluginContext,
                    });
                }
                : undefined;
            _rest = createRestServer({
                getSettings: async () => {
                    const all = _db.getAllSettings();
                    // Redact password-typed fields so plaintext secrets are never sent to the client
                    const redacted = { ...all };
                    for (const schema of MODULE_SCHEMAS) {
                        for (const field of schema.fields) {
                            if (field.type === 'password') {
                                const key = `${schema.id}.${field.key}`;
                                if (key in redacted) {
                                    redacted[key] = '••••••••';
                                }
                            }
                        }
                    }
                    return redacted;
                },
                putSettings: async (settings) => {
                    for (const [key, value] of Object.entries(settings)) {
                        // Skip redacted placeholders so we never overwrite real secrets
                        if (String(value) === '••••••••')
                            continue;
                        _db.setSetting(key, String(value));
                    }
                },
                getLayout: async () => _db.getLayout('default') ?? [],
                putLayout: async (layout) => {
                    _db.setLayout('default', layout);
                },
                syncModules: (layoutIds) => {
                    // Always keep system modules running regardless of grid contents
                    const ids = [...new Set([...layoutIds, ...SYSTEM_MODULE_IDS])];
                    _modules = syncModulesWithLayout(ids, _modules, _db, { dataBus, notifications: _notificationQueue, gpioFactory, aiProviders }, logger);
                    // Notify connected clients about layout change
                    _ws?.broadcast({
                        type: 'layout_change',
                        payload: null,
                        timestamp: new Date().toISOString(),
                    });
                },
                postAsk: async (question) => ({
                    id: crypto.randomUUID(),
                    question,
                    response: 'Ask feature not yet available.',
                    timestamp: new Date().toISOString(),
                    tool_calls_made: 0,
                }),
                ...pluginHandlers,
                restartModule: async (id) => {
                    const schema = MODULE_SCHEMAS.find((s) => s.id === id);
                    if (!schema)
                        throw new Error(`Unknown module: ${id}`);
                    const result = rebootModule(id, _modules, _db, { dataBus, notifications: _notificationQueue, gpioFactory, aiProviders }, logger);
                    return { ok: true, running: result !== null };
                },
                // AI Assist handler (optional — omit if no providers configured)
                ...(aiAssistHandler ? { aiAssist: aiAssistHandler } : {}),
                // AI model listing (uses same env-based providers)
                ...(aiProviders.size > 0
                    ? {
                        listAiModels: async (providerId) => {
                            const provider = aiProviders.get(providerId);
                            if (!provider)
                                return [];
                            return provider.listModels();
                        },
                    }
                    : {}),
                // Display hardware handlers
                getDisplayCapabilities: async () => _displayHardware.capabilities,
                getDisplaySettings: async () => ({
                    brightness: _displayHardware.getBrightness() ?? undefined,
                    contrast: _displayHardware.getContrast() ?? undefined,
                    rotation: _displayHardware.getRotation() ?? undefined,
                }),
                setDisplayBrightness: _displayHardware.capabilities.brightness.available
                    ? async (value) => {
                        _displayHardware.setBrightness(value);
                        _db.setSetting('display.brightness', String(value));
                    }
                    : undefined,
                setDisplayContrast: _displayHardware.capabilities.contrast.available
                    ? async (value) => {
                        _displayHardware.setContrast(value);
                        _db.setSetting('display.contrast', String(value));
                    }
                    : undefined,
                setDisplayRotation: _displayHardware.capabilities.rotation.available
                    ? async (value, persistent) => {
                        _displayHardware.setRotation(value, persistent);
                        _db.setSetting('display.rotation', String(value));
                    }
                    : undefined,
            }, {
                port,
                staticDir,
                authToken,
                bindAddress,
                photoDir: () => _db.getSetting('photo-slideshow.photoDirectory') ?? undefined,
            });
            await _rest.ready();
            _port = _rest.port;
            log.info('REST server ready', { port: _port });
            // 7. WebSocket server (attached to REST's HTTP server)
            _ws = createWsServer({ server: _rest.server, authToken });
            await _ws.ready();
            log.info('WebSocket server ready');
            // Wire data bus → WebSocket: forward all module data to connected display clients
            dataBus.onMessage((msg) => {
                _ws.broadcast({ type: 'plugin_data', payload: msg, timestamp: new Date().toISOString() });
            });
            // Send cached data bus state to newly connected clients so they don't
            // have to wait until the next module refresh (which can be up to 1 hour).
            _ws.on('connection', () => {
                for (const channel of dataBus.getChannels()) {
                    const latest = dataBus.getLatest(channel);
                    if (latest) {
                        _ws.broadcast({
                            type: 'plugin_data',
                            payload: latest,
                            timestamp: new Date().toISOString(),
                        });
                    }
                }
            });
            // 8. Boot built-in modules based on saved grid layout
            //    System modules (like PIR) always boot regardless of grid placement.
            _notificationQueue = createNotificationQueue();
            const savedLayout = _db.getLayout('default');
            const parsed = savedLayout;
            const layoutIds = Array.isArray(parsed?.widgets)
                ? parsed.widgets.map((w) => w.id)
                : [];
            // Always include system modules so they boot even if not on the grid
            const allIds = [...new Set([...layoutIds, ...SYSTEM_MODULE_IDS])];
            _modules = syncModulesWithLayout(allIds, [], _db, { dataBus, notifications: _notificationQueue, gpioFactory, aiProviders }, logger);
            // 10. Display DPMS control via PIR presence
            if (enableDisplayControl) {
                _displayControl = createDisplayControl({ dataBus, logger });
                log.info('Display control enabled (DPMS via PIR)');
            }
            // 11. Restore persisted display settings
            if (_displayHardware) {
                try {
                    const savedBrightness = _db.getSetting('display.brightness');
                    if (savedBrightness != null && _displayHardware.capabilities.brightness.available) {
                        const v = parseInt(savedBrightness, 10);
                        if (Number.isFinite(v) && v >= 0 && v <= 100) {
                            _displayHardware.setBrightness(v);
                            log.info('Restored display brightness', { value: v });
                        }
                    }
                    const savedContrast = _db.getSetting('display.contrast');
                    if (savedContrast != null && _displayHardware.capabilities.contrast.available) {
                        const v = parseInt(savedContrast, 10);
                        if (Number.isFinite(v) && v >= 0 && v <= 100) {
                            _displayHardware.setContrast(v);
                            log.info('Restored display contrast', { value: v });
                        }
                    }
                    const savedRotation = _db.getSetting('display.rotation');
                    if (savedRotation != null && _displayHardware.capabilities.rotation.available) {
                        const v = parseInt(savedRotation, 10);
                        if ([0, 90, 180, 270].includes(v)) {
                            _displayHardware.setRotation(v);
                            log.info('Restored display rotation', { value: v });
                        }
                    }
                }
                catch (err) {
                    log.error('Failed to restore display settings', err);
                }
            }
            log.info('Host service boot complete');
        }
        catch (err) {
            // Clean up any resources that were initialized before the failure
            log.error('Boot failed, cleaning up', err);
            for (const mod of _modules) {
                try {
                    if (mod.timer !== undefined)
                        clearInterval(mod.timer);
                    mod.instance.close();
                }
                catch {
                    /* ignore */
                }
            }
            try {
                _connectorRunner?.close();
            }
            catch {
                /* ignore cleanup errors */
            }
            try {
                _displayControl?.close();
            }
            catch {
                /* ignore cleanup errors */
            }
            try {
                _notificationQueue?.close();
            }
            catch {
                /* ignore cleanup errors */
            }
            try {
                await _ws?.close();
            }
            catch {
                /* ignore cleanup errors */
            }
            try {
                await _rest?.close();
            }
            catch {
                /* ignore cleanup errors */
            }
            try {
                _db?.close();
            }
            catch {
                /* ignore cleanup errors */
            }
            throw err;
        }
    })();
    // Set up SIGINT/SIGTERM graceful shutdown
    const shutdownHandler = () => {
        void (async () => {
            try {
                for (const mod of _modules) {
                    try {
                        if (mod.timer !== undefined)
                            clearInterval(mod.timer);
                        mod.instance.close();
                    }
                    catch {
                        /* ignore */
                    }
                }
                _connectorRunner?.close();
                _displayControl?.close();
                _notificationQueue?.close();
                await _ws?.close();
                await _rest?.close();
                _db?.close();
            }
            catch (err) {
                log.error('Shutdown error', err);
            }
        })();
    };
    process.once('SIGINT', shutdownHandler);
    process.once('SIGTERM', shutdownHandler);
    return {
        ready,
        get port() {
            return _port;
        },
        async close() {
            process.off('SIGINT', shutdownHandler);
            process.off('SIGTERM', shutdownHandler);
            for (const mod of _modules) {
                try {
                    if (mod.timer !== undefined)
                        clearInterval(mod.timer);
                    mod.instance.close();
                }
                catch {
                    /* ignore */
                }
            }
            _connectorRunner?.close();
            _displayControl?.close();
            _notificationQueue?.close();
            await _ws?.close();
            await _rest?.close();
            _db?.close();
        },
        get db() {
            return _db;
        },
        get rest() {
            return _rest;
        },
        get ws() {
            return _ws;
        },
        get plugins() {
            return _plugins;
        },
        get modules() {
            return _modules;
        },
        get dataBus() {
            return _dataBus;
        },
    };
}
//# sourceMappingURL=host-service.js.map