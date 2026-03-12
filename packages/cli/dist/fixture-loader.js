export function createFixtureLoader(options) {
    const { fixturesDir, readDir, readFile } = options;
    async function list() {
        try {
            const files = await readDir();
            return files.filter((f) => f.endsWith('.json'));
        }
        catch {
            return [];
        }
    }
    async function load(name) {
        // Prevent path traversal attacks
        if (name.includes('..') || name.includes('/')) {
            throw new Error(`Invalid fixture name: ${name}`);
        }
        const path = `${fixturesDir}/${name}`;
        const content = await readFile(path);
        return JSON.parse(content);
    }
    async function loadAll() {
        const files = await list();
        const result = {};
        for (const file of files) {
            try {
                const key = file.replace(/\.json$/, '');
                result[key] = await load(file);
            }
            catch {
                // Skip files that fail to parse
            }
        }
        return result;
    }
    return { list, load, loadAll };
}
//# sourceMappingURL=fixture-loader.js.map