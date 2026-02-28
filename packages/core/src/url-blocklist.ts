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

/** Checks if an IPv6 hostname (with brackets) is in a blocked range */
function isBlockedIPv6(hostname: string): boolean {
  if (!hostname.startsWith('[') || !hostname.endsWith(']')) return false;
  const addr = hostname.slice(1, -1).toLowerCase();

  // Loopback ::1
  if (addr === '::1') return true;

  // Unspecified address ::
  if (addr === '::') return true;

  // Link-local fe80::/10 (fe80–febf)
  if (/^fe[89ab]/i.test(addr)) return true;

  // Unique-local fc00::/7 (fc00–fdff)
  if (/^f[cd]/i.test(addr)) return true;

  // IPv4-mapped ::ffff:w.x.y.z — check embedded dotted-decimal address
  if (addr.startsWith('::ffff:')) {
    const embedded = addr.slice(7);
    if (
      isLoopbackIpv4(embedded) ||
      isLinkLocalIpv4(embedded) ||
      isPrivateIpv4(embedded) ||
      embedded === '0.0.0.0'
    ) {
      return true;
    }
  }

  return false;
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
    // Strip trailing dot (FQDN form: "localhost." is equivalent to "localhost")
    hostname = new URL(urlString).hostname.toLowerCase().replace(/\.$/, '');
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

  // IPv6 addresses (includes loopback ::1, link-local fe80::/10, unique-local fc00::/7, etc.)
  if (hostname.startsWith('[')) {
    if (isBlockedIPv6(hostname)) {
      return `Blocked: IPv6 address ${hostname}`;
    }
    // Non-blocked IPv6 addresses are allowed (or handled by allowPrivate above)
    return null;
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
