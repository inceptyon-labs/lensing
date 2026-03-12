import { validateManifest } from './manifest-validator';
import { createFixtureLoader } from './fixture-loader';
export function createDevServer(options) {
    const { pluginDir, fixturesDir, readFile, readDir, watch } = options;
    let running = false;
    let manifest;
    let fixtures = {};
    let watcher;
    const reloadCallbacks = [];
    const fixtureLoader = createFixtureLoader({
        fixturesDir,
        readDir,
        readFile,
    });
    async function loadManifest() {
        const manifestPath = `${pluginDir}/plugin.json`;
        const content = await readFile(manifestPath);
        const parsed = JSON.parse(content);
        const result = validateManifest(parsed);
        if (!result.valid) {
            throw new Error(`Invalid plugin manifest: ${result.errors.join(', ')}`);
        }
        return result.manifest;
    }
    async function loadFixtures() {
        return await fixtureLoader.loadAll();
    }
    function notifyReload() {
        for (const callback of reloadCallbacks) {
            try {
                callback();
            }
            catch (err) {
                // Log but don't crash on callback errors
                console.error('Error in reload callback:', err);
            }
        }
    }
    async function reload() {
        if (!running) {
            throw new Error('Server is not running');
        }
        manifest = await loadManifest();
        fixtures = await loadFixtures();
        notifyReload();
    }
    async function start() {
        if (running)
            return;
        manifest = await loadManifest();
        fixtures = await loadFixtures();
        watcher = watch(pluginDir, async (_event, _filename) => {
            try {
                await reload();
            }
            catch (err) {
                // Log but don't crash on watcher reload errors
                console.error('Error reloading on file change:', err);
            }
        });
        running = true;
    }
    function stop() {
        if (!running)
            return;
        if (watcher) {
            watcher.close();
            watcher = undefined;
        }
        running = false;
    }
    function isRunning() {
        return running;
    }
    function getManifest() {
        return manifest;
    }
    function getFixtures() {
        return fixtures;
    }
    function onReload(callback) {
        reloadCallbacks.push(callback);
    }
    return {
        start,
        stop,
        reload,
        isRunning,
        getManifest,
        getFixtures,
        onReload,
    };
}
//# sourceMappingURL=dev-server.js.map