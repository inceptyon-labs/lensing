/**
 * Auth middleware utilities for REST server Bearer token authentication.
 */
/**
 * Extracts the Bearer token from an Authorization header value.
 * Returns null if the header is missing, malformed, or uses a non-Bearer scheme.
 */
export declare function extractBearerToken(header: string | undefined): string | null;
/**
 * Determines whether a route requires authentication.
 * Public routes: /health, read-only marketplace browsing, plugin template reads, OPTIONS.
 * Everything else requires auth.
 */
export declare function isProtectedRoute(path: string, method: string): boolean;
//# sourceMappingURL=auth-middleware.d.ts.map