const SIZE_LIMIT = 8 * 1024 * 1024; // 8MB uncompressed
function resolvePath(obj, path) {
    // Convert array access notation to dot notation: items[0].title → items.0.title
    const normalized = path.replace(/\[(\d+)\]/g, '.$1');
    const parts = normalized.split('.');
    let current = obj;
    for (const part of parts) {
        if (current === null || current === undefined || typeof current !== 'object') {
            return false;
        }
        current = current[part];
    }
    return current !== undefined && current !== null;
}
function extractPlaceholders(html) {
    const matches = html.match(/\{\{([^}]+)\}\}/g) ?? [];
    return matches.map((m) => m.slice(2, -2).trim());
}
export function validatePublish(input, existingPluginIds) {
    const errors = [];
    // Required fields
    if (!input.id) {
        errors.push({ field: 'id', code: 'REQUIRED', message: 'Plugin ID is required' });
    }
    else if (existingPluginIds.includes(input.id)) {
        errors.push({ field: 'id', code: 'DUPLICATE_ID', message: 'Plugin ID already exists' });
    }
    if (!input.name) {
        errors.push({ field: 'name', code: 'REQUIRED', message: 'Plugin name is required' });
    }
    if (!input.version) {
        errors.push({ field: 'version', code: 'REQUIRED', message: 'Plugin version is required' });
    }
    // Connector validation
    if (!input.connector.url) {
        errors.push({ field: 'connector.url', code: 'REQUIRED', message: 'Connector URL is required' });
    }
    if (!input.connector.type) {
        errors.push({
            field: 'connector.type',
            code: 'REQUIRED',
            message: 'Connector type is required',
        });
    }
    if (!input.connectorTested) {
        errors.push({
            field: 'connectorTested',
            code: 'CONNECTOR_NOT_TESTED',
            message: 'Connector must be tested before publishing',
        });
    }
    // Template HTML validation
    if (!input.html || !input.html.trim()) {
        errors.push({ field: 'html', code: 'REQUIRED', message: 'Template HTML is required' });
    }
    else {
        // Placeholder validation (only if html is non-empty)
        const placeholders = extractPlaceholders(input.html);
        if (placeholders.length > 0) {
            const unresolved = placeholders.filter((p) => !resolvePath(input.sampleData, p));
            if (unresolved.length > 0) {
                errors.push({
                    field: 'html',
                    code: 'UNRESOLVED_PLACEHOLDERS',
                    message: `Unresolved placeholders: ${unresolved.join(', ')}`,
                });
            }
        }
    }
    // Size validation — estimate uncompressed content size
    const sizeEstimate = (input.html?.length ?? 0) +
        (input.css?.length ?? 0) +
        (input.description?.length ?? 0) +
        JSON.stringify(input.connector).length +
        JSON.stringify({ id: input.id, name: input.name, version: input.version }).length;
    if (sizeEstimate > SIZE_LIMIT) {
        errors.push({
            field: 'size',
            code: 'TOO_LARGE',
            message: `Package size exceeds uncompressed limit (8MB)`,
        });
    }
    return { valid: errors.length === 0, errors };
}
//# sourceMappingURL=publish-validation.js.map