const HHMM = /^(\d{1,2}):(\d{2})$/;
function toMinutes(s) {
    const m = HHMM.exec(String(s).trim());
    if (!m)
        return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59)
        return null;
    return h * 60 + min;
}
/** True when `now` (local time) falls in [start, end); the window may cross midnight. */
export function isNightTime(now, start, end) {
    const s = toMinutes(start);
    const e = toMinutes(end);
    if (s === null || e === null || s === e)
        return false;
    const cur = now.getHours() * 60 + now.getMinutes();
    return s < e ? cur >= s && cur < e : cur >= s || cur < e;
}
function cfgBool(val, fallback) {
    if (val === true || val === 'true')
        return true;
    if (val === false || val === 'false')
        return false;
    return fallback;
}
function cfgTime(val, fallback) {
    return typeof val === 'string' && val ? val : fallback;
}
function cfgPercent(val, fallback) {
    if (val === undefined || val === null || val === '')
        return fallback;
    const n = Number(val);
    return Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : fallback;
}
/** Parse the night-mode module config, tolerating string values and missing keys. */
export function parseNightConfig(config) {
    return {
        enabled: cfgBool(config?.['enabled'], true),
        startTime: cfgTime(config?.['startTime'], '22:00'),
        endTime: cfgTime(config?.['endTime'], '06:00'),
        brightness: cfgPercent(config?.['brightness'], 10),
    };
}
//# sourceMappingURL=night-mode.js.map