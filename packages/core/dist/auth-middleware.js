/**
 * Auth middleware utilities for REST server Bearer token authentication.
 */
import { hostname as osHostname } from 'node:os';
import { isIP } from 'node:net';
/**
 * Extracts the Bearer token from an Authorization header value.
 * Returns null if the header is missing, malformed, or uses a non-Bearer scheme.
 */
export function extractBearerToken(header) {
    if (!header)
        return null;
    const match = header.match(/^bearer\s+(.+)/i);
    if (!match)
        return null;
    const token = match[1].trim();
    return token.length > 0 ? token : null;
}
/**
 * Determines whether a route requires authentication.
 * Public routes: /health, read-only marketplace browsing, plugin template reads, OPTIONS.
 * Everything else requires auth.
 */
export function isProtectedRoute(path, method) {
    if (method === 'OPTIONS')
        return false;
    if (path === '/health')
        return false;
    // Read-only marketplace browsing is public
    if (method === 'GET' && path === '/marketplace')
        return false;
    if (method === 'GET' && path === '/marketplace/categories')
        return false;
    if (method === 'GET' && path === '/marketplace/updates')
        return false;
    // GET /marketplace/:id is public (plugin details page)
    if (method === 'GET' && /^\/marketplace\/[^/]+$/.test(path))
        return false;
    // Display-consumed read routes are public (same-origin frontend fetches these without auth)
    if (method === 'GET' && path === '/plugins')
        return false;
    if (method === 'GET' && /^\/plugins\/[^/]+\/template$/.test(path))
        return false;
    if (method === 'GET' && path === '/layout')
        return false;
    if (method === 'GET' && path.startsWith('/display/'))
        return false;
    if (method === 'GET' && path === '/api/admin/marketplace')
        return false;
    if (method === 'GET' && path === '/data-bus')
        return false;
    if (method === 'GET' && path.startsWith('/photos/'))
        return false;
    return true;
}
/** True for 127.0.0.0/8, ::1 and IPv4-mapped loopback addresses. */
export function isLoopbackAddress(addr) {
    if (!addr)
        return false;
    if (addr === '::1')
        return true;
    if (addr.startsWith('::ffff:'))
        return isLoopbackAddress(addr.slice(7));
    return /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(addr);
}
const LAN_SUFFIXES = ['.local', '.lan', '.home', '.home.arpa', '.internal', '.localdomain'];
/**
 * Host header allowlist (DNS rebinding defense). Allows IP literals, localhost,
 * single-label names, LAN-style suffixes, the machine hostname and extra allowedHosts.
 */
export function isHostAllowed(hostHeader, allowedHosts = []) {
    if (!hostHeader)
        return true;
    const host = hostHeader.trim().toLowerCase();
    if (host.startsWith('['))
        return true; // bracketed IPv6 literal
    const name = host.replace(/:\d+$/, '');
    if (isIP(name))
        return true;
    if (name === 'localhost' || !name.includes('.'))
        return true;
    if (LAN_SUFFIXES.some((s) => name.endsWith(s)))
        return true;
    if (name === osHostname().toLowerCase())
        return true;
    return allowedHosts.some((h) => h.trim().toLowerCase() === name);
}
/** When an Origin header is present, its host:port must equal the request Host header. */
export function isOriginAllowed(origin, hostHeader) {
    if (origin === undefined)
        return true;
    try {
        return new URL(origin).host.toLowerCase() === (hostHeader ?? '').trim().toLowerCase();
    }
    catch {
        return false;
    }
}
/**
 * Builds a Host check that calls `warn` once per rejected hostname,
 * pointing at LENSING_ALLOWED_HOSTS.
 */
export function createHostCheck(allowedHosts = [], warn) {
    const warned = new Set();
    return (hostHeader) => {
        if (isHostAllowed(hostHeader, allowedHosts))
            return true;
        const name = (hostHeader ?? '').toLowerCase().replace(/:\d+$/, '');
        if (!warned.has(name)) {
            warned.add(name);
            warn?.(`Rejected request for unknown Host "${name}". Add it to LENSING_ALLOWED_HOSTS to allow it.`);
        }
        return false;
    };
}
//# sourceMappingURL=auth-middleware.js.map