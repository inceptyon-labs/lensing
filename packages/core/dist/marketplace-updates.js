/**
 * Compare two semver version strings.
 * Returns 1 if a > b, -1 if a < b, 0 if equal.
 * Only compares major.minor.patch numeric parts.
 */
export function compareSemver(a, b) {
    const parse = (v) => {
        const numeric = v.split(/[^0-9.]/)[0] ?? v;
        const parts = numeric.split('.').map(Number);
        return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
    };
    const [aMaj, aMin, aPat] = parse(a);
    const [bMaj, bMin, bPat] = parse(b);
    if (aMaj !== bMaj)
        return aMaj > bMaj ? 1 : -1;
    if (aMin !== bMin)
        return aMin > bMin ? 1 : -1;
    if (aPat !== bPat)
        return aPat > bPat ? 1 : -1;
    return 0;
}
/**
 * Compare installed plugins against the marketplace to find available updates.
 * Returns only plugins where marketplace version > installed version.
 */
export function checkForUpdates(installed, marketplace) {
    const marketplaceById = new Map(marketplace.map((p) => [p.id, p]));
    const updates = [];
    for (const plugin of installed) {
        const marketplacePlugin = marketplaceById.get(plugin.plugin_id);
        if (!marketplacePlugin)
            continue;
        const currentVersion = plugin.manifest.version;
        const newVersion = marketplacePlugin.version;
        if (compareSemver(newVersion, currentVersion) > 0) {
            updates.push({
                pluginId: plugin.plugin_id,
                pluginName: plugin.manifest.name,
                currentVersion,
                newVersion,
                downloadUrl: marketplacePlugin.downloadUrl,
            });
        }
    }
    return updates;
}
//# sourceMappingURL=marketplace-updates.js.map