/**
 * Auth middleware utilities for REST server Bearer token authentication.
 */
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
    return true;
}
//# sourceMappingURL=auth-middleware.js.map