import { describe, it, expect } from 'vitest';
import { isBlockedUrl, getBlockReason } from '../url-blocklist';

describe('isBlockedUrl', () => {
  describe('localhost and loopback', () => {
    it('should block localhost', () => {
      expect(isBlockedUrl('http://localhost/api')).toBe(true);
      expect(isBlockedUrl('https://localhost:8080/path')).toBe(true);
    });

    it('should block 127.0.0.1', () => {
      expect(isBlockedUrl('http://127.0.0.1/')).toBe(true);
      expect(isBlockedUrl('http://127.0.0.1:3000/api')).toBe(true);
    });

    it('should block full 127.x.x.x range', () => {
      expect(isBlockedUrl('http://127.0.0.2/')).toBe(true);
      expect(isBlockedUrl('http://127.255.255.255/')).toBe(true);
    });

    it('should block IPv6 loopback ::1', () => {
      expect(isBlockedUrl('http://[::1]/')).toBe(true);
      expect(isBlockedUrl('http://[::1]:8080/api')).toBe(true);
    });

    it('should block 0.0.0.0', () => {
      expect(isBlockedUrl('http://0.0.0.0/')).toBe(true);
      expect(isBlockedUrl('http://0.0.0.0:3000/')).toBe(true);
    });
  });

  describe('private IP ranges', () => {
    it('should block 10.x.x.x range', () => {
      expect(isBlockedUrl('http://10.0.0.1/')).toBe(true);
      expect(isBlockedUrl('http://10.255.255.255/')).toBe(true);
    });

    it('should block 172.16-31.x.x range', () => {
      expect(isBlockedUrl('http://172.16.0.1/')).toBe(true);
      expect(isBlockedUrl('http://172.31.255.255/')).toBe(true);
    });

    it('should NOT block 172.15.x.x or 172.32.x.x', () => {
      expect(isBlockedUrl('http://172.15.0.1/')).toBe(false);
      expect(isBlockedUrl('http://172.32.0.1/')).toBe(false);
    });

    it('should block 192.168.x.x range', () => {
      expect(isBlockedUrl('http://192.168.0.1/')).toBe(true);
      expect(isBlockedUrl('http://192.168.1.100:8123/')).toBe(true);
    });
  });

  describe('link-local', () => {
    it('should block 169.254.x.x range', () => {
      expect(isBlockedUrl('http://169.254.0.1/')).toBe(true);
      expect(isBlockedUrl('http://169.254.169.254/')).toBe(true);
    });
  });

  describe('cloud metadata endpoints', () => {
    it('should block AWS/Azure metadata (169.254.169.254)', () => {
      expect(isBlockedUrl('http://169.254.169.254/latest/meta-data/')).toBe(true);
    });

    it('should block GCP metadata hostname', () => {
      expect(isBlockedUrl('http://metadata.google.internal/')).toBe(true);
    });
  });

  describe('allowPrivate override', () => {
    it('should allow private IPs when allowPrivate is true', () => {
      expect(isBlockedUrl('http://192.168.1.100:8123/', { allowPrivate: true })).toBe(false);
      expect(isBlockedUrl('http://10.0.0.1/', { allowPrivate: true })).toBe(false);
      expect(isBlockedUrl('http://172.16.0.1/', { allowPrivate: true })).toBe(false);
    });

    it('should still block localhost even with allowPrivate', () => {
      expect(isBlockedUrl('http://localhost/', { allowPrivate: true })).toBe(true);
      expect(isBlockedUrl('http://127.0.0.1/', { allowPrivate: true })).toBe(true);
      expect(isBlockedUrl('http://[::1]/', { allowPrivate: true })).toBe(true);
      expect(isBlockedUrl('http://0.0.0.0/', { allowPrivate: true })).toBe(true);
    });

    it('should still block link-local even with allowPrivate', () => {
      expect(isBlockedUrl('http://169.254.169.254/', { allowPrivate: true })).toBe(true);
    });

    it('should still block metadata endpoints even with allowPrivate', () => {
      expect(isBlockedUrl('http://metadata.google.internal/', { allowPrivate: true })).toBe(true);
    });
  });

  describe('allowed URLs', () => {
    it('should allow public hostnames', () => {
      expect(isBlockedUrl('https://api.example.com/data')).toBe(false);
      expect(isBlockedUrl('https://api.coingecko.com/api/v3/')).toBe(false);
    });

    it('should allow public IP addresses', () => {
      expect(isBlockedUrl('http://8.8.8.8/')).toBe(false);
      expect(isBlockedUrl('http://1.1.1.1/')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should block invalid URLs', () => {
      expect(isBlockedUrl('not-a-url')).toBe(true);
      expect(isBlockedUrl('')).toBe(true);
    });

    it('should be case-insensitive for hostnames', () => {
      expect(isBlockedUrl('http://LOCALHOST/')).toBe(true);
      expect(isBlockedUrl('http://Metadata.Google.Internal/')).toBe(true);
    });
  });
});

describe('getBlockReason', () => {
  it('should return reason for localhost', () => {
    const reason = getBlockReason('http://localhost/');
    expect(reason).toBeTruthy();
    expect(reason).toContain('localhost');
  });

  it('should return reason for private IP', () => {
    const reason = getBlockReason('http://192.168.1.1/');
    expect(reason).toBeTruthy();
    expect(reason).toContain('private');
  });

  it('should return reason for link-local', () => {
    const reason = getBlockReason('http://169.254.1.1/');
    expect(reason).toBeTruthy();
    expect(reason).toContain('link-local');
  });

  it('should return reason for metadata endpoint', () => {
    const reason = getBlockReason('http://metadata.google.internal/');
    expect(reason).toBeTruthy();
    expect(reason).toContain('metadata');
  });

  it('should return null for allowed URLs', () => {
    expect(getBlockReason('https://api.example.com/')).toBeNull();
  });

  it('should return reason for invalid URL', () => {
    const reason = getBlockReason('not-a-url');
    expect(reason).toBeTruthy();
  });
});
