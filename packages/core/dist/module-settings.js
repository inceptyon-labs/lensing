/** Read a module's config from flat DB settings keys (e.g. "weather.apiKey") */
export function readModuleConfig(db, schema) {
    const prefix = schema.id;
    const enabledRaw = db.getSetting(`${prefix}.enabled`);
    const enabled = enabledRaw === 'true';
    const values = {};
    for (const field of schema.fields) {
        const raw = db.getSetting(`${prefix}.${field.key}`);
        if (raw !== undefined) {
            values[field.key] = coerceValue(raw, field.type);
        }
        else if (field.default !== undefined) {
            values[field.key] = field.default;
        }
    }
    return { enabled, values };
}
/** Secret settings that are only valid for the URL they were saved with */
const URL_BOUND_SECRETS = [
    { urlKey: 'home-assistant.url', secretKey: 'home-assistant.token' },
    { urlKey: 'calendar.serverUrl', secretKey: 'calendar.password' },
];
const REDACTED_PLACEHOLDER = '••••••••';
/**
 * Call before saving flat settings (keys like "home-assistant.url"). If a URL changes and
 * no new secret is supplied, the stored secret is deleted so it can't be sent to the new host.
 */
export function clearSecretsForChangedUrls(db, incoming) {
    for (const { urlKey, secretKey } of URL_BOUND_SECRETS) {
        if (!(urlKey in incoming))
            continue;
        if (String(incoming[urlKey]) === (db.getSetting(urlKey) ?? ''))
            continue;
        const supplied = incoming[secretKey];
        if (supplied !== undefined && String(supplied) !== REDACTED_PLACEHOLDER)
            continue;
        db.deleteSetting(secretKey);
    }
}
/** Write a module's config as flat DB settings keys */
export function writeModuleConfig(db, moduleId, config) {
    db.setSetting(`${moduleId}.enabled`, String(config.enabled));
    for (const [key, value] of Object.entries(config.values)) {
        db.setSetting(`${moduleId}.${key}`, String(value));
    }
}
/** Coerce a string DB value to the correct type for a field */
function coerceValue(raw, type) {
    if (type === 'number') {
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : 0;
    }
    if (type === 'boolean') {
        return raw === 'true';
    }
    return raw;
}
//# sourceMappingURL=module-settings.js.map