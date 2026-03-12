export const DEFAULT_SCENES = [
    {
        name: 'morning',
        layout: [],
        active_plugins: [],
        visuals: { opacity: 0.9, color_temp: 'warm' },
    },
    {
        name: 'evening',
        layout: [],
        active_plugins: [],
        visuals: { opacity: 0.7, color_temp: 'warm' },
    },
    {
        name: 'ambient',
        layout: [],
        active_plugins: [],
        visuals: { opacity: 0.5, color_temp: 'neutral' },
    },
    {
        name: 'focus',
        layout: [],
        active_plugins: [],
        visuals: { opacity: 0.95, color_temp: 'cool' },
    },
    {
        name: 'alert',
        layout: [],
        active_plugins: [],
        visuals: { opacity: 1.0, color_temp: 'neutral' },
    },
];
function safeCall(cb, scene) {
    try {
        cb(scene);
    }
    catch {
        // Isolate listener errors
    }
}
export function createSceneManager(options = {}) {
    const { persistence } = options;
    const scenes = new Map(DEFAULT_SCENES.map((s) => [s.name, { ...s }]));
    let activeSceneName = 'ambient';
    let closed = false;
    const listeners = new Set();
    function getActive() {
        return scenes.get(activeSceneName);
    }
    function notifyListeners() {
        const active = getActive();
        for (const cb of [...listeners]) {
            safeCall(cb, active);
        }
    }
    function persist() {
        if (persistence) {
            void persistence.save(Array.from(scenes.values()), activeSceneName);
        }
    }
    const manager = {
        getScenes() {
            return Array.from(scenes.values());
        },
        getScene(name) {
            return scenes.get(name);
        },
        getActiveScene() {
            return getActive();
        },
        getActiveSceneName() {
            return activeSceneName;
        },
        switchTo(name) {
            if (!scenes.has(name)) {
                throw new Error(`Unknown scene: ${name}`);
            }
            if (name === activeSceneName) {
                return getActive();
            }
            activeSceneName = name;
            if (!closed) {
                notifyListeners();
                persist();
            }
            return getActive();
        },
        addScene(scene) {
            if (scenes.has(scene.name)) {
                throw new Error(`Scene '${scene.name}' already exists`);
            }
            scenes.set(scene.name, { ...scene });
        },
        updateScene(name, updates) {
            const existing = scenes.get(name);
            if (!existing) {
                throw new Error(`Unknown scene: ${name}`);
            }
            const updated = { ...existing, ...updates };
            scenes.set(name, updated);
            if (name === activeSceneName && !closed) {
                notifyListeners();
                persist();
            }
            return updated;
        },
        removeScene(name) {
            if (!scenes.has(name)) {
                throw new Error(`Unknown scene: ${name}`);
            }
            if (name === activeSceneName) {
                throw new Error('Cannot remove the active scene');
            }
            scenes.delete(name);
        },
        onSceneChange(callback) {
            listeners.add(callback);
            return () => {
                listeners.delete(callback);
            };
        },
        close() {
            closed = true;
            listeners.clear();
        },
        async loadFromPersistence() {
            if (!persistence)
                return manager;
            const data = await persistence.load();
            if (data) {
                scenes.clear();
                for (const scene of data.scenes) {
                    scenes.set(scene.name, { ...scene });
                }
                if (scenes.has(data.activeScene)) {
                    activeSceneName = data.activeScene;
                }
                else if (scenes.size > 0) {
                    // Fallback: first loaded scene to avoid invalid activeSceneName
                    activeSceneName = scenes.keys().next().value;
                }
            }
            return manager;
        },
    };
    return manager;
}
//# sourceMappingURL=scene-manager.js.map