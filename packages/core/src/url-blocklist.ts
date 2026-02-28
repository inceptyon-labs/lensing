/**
 * SSRF protection URL blocklist.
 * Blocks requests to localhost, private IP ranges, link-local addresses,
 * and cloud metadata endpoints.
 */

/** Options for URL blocklist checking */
export interface BlocklistOptions {
  /**
   * Allow private IP ranges (10.x, 172.16-31.x, 192.168.x) — for home-lab use cases.
   * Loopback, link-local, and metadata endpoints are always blocked regardless.
   */
  allowPrivate?: boolean;
}

/** Checks if an IP string is in the 127.0.0.0/8 loopback range */
function isLoopbackIpv4(hostname: string): boolean {
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;
  return parts[0] === '127';
}

/** Checks if an IPv4 hostname is in a private range */
function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    return false;
  }
  const [a, b] = parts;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 172.16.0.0/12
  if (a === 172 && b !== undefined && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  return false;
}

/** Checks if an IPv4 hostname is in the link-local range 169.254.0.0/16 */
function isLinkLocalIpv4(hostname: string): boolean {
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;
  return parts[0] === '169' && parts[1] === '254';
}

/** Well-known metadata hostnames that must always be blocked */
const BLOCKED_HOSTNAMES = new Set([
  'metadata.google.internal',
]);

/**
 * Returns the reason a URL is blocked, or null if the URL is allowed.
 */
export function getBlockReason(urlString: string, options: BlocklistOptions = {}): string | null {
  let hostname: string;
  try {
    hostname = new URL(urlString).hostname.toLowerCase();
  } catch {
    return 'Invalid URL';
  }

  // Blocked hostnames (metadata endpoints)
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return `Blocked metadata endpoint: ${hostname}`;
  }

  // localhost
  if (hostname === 'localhost') {
    return 'Blocked: localhost';
  }

  // 0.0.0.0
  if (hostname === '0.0.0.0') {
    return 'Blocked: 0.0.0.0';
  }

  // IPv6 loopback — URL.hostname includes brackets: "[::1]"
  if (hostname === '[::1]') {
    return 'Blocked: IPv6 loopback ::1';
  }

  // 127.x.x.x loopback range
  if (isLoopbackIpv4(hostname)) {
    return `Blocked: loopback address ${hostname}`;
  }

  // 169.254.x.x link-local — always blocked regardless of allowPrivate
  if (isLinkLocalIpv4(hostname)) {
    return `Blocked: link-local address ${hostname}`;
  }

  // Private IP ranges — only blocked when allowPrivate is false
  if (!options.allowPrivate && isPrivateIpv4(hostname)) {
    return `Blocked: private IP range ${hostname}`;
  }

  return null;
}

/**
 * Returns true if the URL should be blocked to prevent SSRF attacks.
 *
 * @param urlString - The URL to check
 * @param options - Optional override settings (e.g. allowPrivate for home-lab)
 */
export function isBlockedUrl(urlString: string, options: BlocklistOptions = {}): boolean {
  return getBlockReason(urlString, options) !== null;
}
