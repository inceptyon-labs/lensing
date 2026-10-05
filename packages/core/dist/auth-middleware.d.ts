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
/** True for 127.0.0.0/8, ::1 and IPv4-mapped loopback addresses. */
export declare function isLoopbackAddress(addr: string | undefined): boolean;
/**
 * Host header allowlist (DNS rebinding defense). Allows IP literals, localhost,
 * single-label names, LAN-style suffixes, the machine hostname and extra allowedHosts.
 */
export declare function isHostAllowed(hostHeader: string | undefined, allowedHosts?: string[]): boolean;
/** When an Origin header is present, its host:port must equal the request Host header. */
export declare function isOriginAllowed(origin: string | undefined, hostHeader: string | undefined): boolean;
/**
 * Builds a Host check that calls `warn` once per rejected hostname,
 * pointing at LENSING_ALLOWED_HOSTS.
 */
export declare function createHostCheck(allowedHosts?: string[], warn?: (message: string) => void): (hostHeader: string | undefined) => boolean;
//# sourceMappingURL=auth-middleware.d.ts.map