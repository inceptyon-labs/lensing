import { describe, it, expect } from 'vitest';
import {
  hasCustomJs,
  buildSandboxSrcdoc,
  SANDBOX_MSG,
  type SandboxDataMessage,
  type SandboxResizeMessage,
} from '../lib/iframe-sandbox';

describe('iframe-sandbox utility', () => {
  describe('hasCustomJs', () => {
    it('should return true when HTML contains a <script> tag', () => {
      const html = '<div>Hello</div><script>console.log("hi")</script>';
      expect(hasCustomJs(html)).toBe(true);
    });

    it('should return true when HTML contains a <script> tag with attributes', () => {
      const html = '<div>Hello</div><script type="module">import x from "./x";</script>';
      expect(hasCustomJs(html)).toBe(true);
    });

    it('should return false when HTML has no script tags', () => {
      const html = '<div>{{title}}</div><p>{{description}}</p>';
      expect(hasCustomJs(html)).toBe(false);
    });

    it('should return true when manifest has server_entry', () => {
      const html = '<div>Hello</div>';
      const manifest = { server_entry: 'index.js' };
      expect(hasCustomJs(html, manifest)).toBe(true);
    });

    it('should return false for plain template with no manifest', () => {
      const html = '<div>{{value}}</div>';
      expect(hasCustomJs(html)).toBe(false);
    });

    it('should be case-insensitive for script tag detection', () => {
      const html = '<div>Hello</div><SCRIPT>alert("hi")</SCRIPT>';
      expect(hasCustomJs(html)).toBe(true);
    });

    it('should not match escaped or text references to script', () => {
      const html = '<div>Use a &lt;script&gt; tag to add JS</div>';
      expect(hasCustomJs(html)).toBe(false);
    });
  });

  describe('buildSandboxSrcdoc', () => {
    it('should include HTML content in the body', () => {
      const srcdoc = buildSandboxSrcdoc('<h1>Hello</h1>', 'h1 { color: red; }');
      expect(srcdoc).toContain('<h1>Hello</h1>');
    });

    it('should include CSS in a style tag', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '.widget { color: blue; }');
      expect(srcdoc).toContain('.widget { color: blue; }');
    });

    it('should include bootstrap script that listens for postMessage', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '');
      expect(srcdoc).toContain('addEventListener');
      expect(srcdoc).toContain('message');
      expect(srcdoc).toContain(SANDBOX_MSG.DATA);
    });

    it('should include resize reporting in bootstrap script', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '');
      expect(srcdoc).toContain(SANDBOX_MSG.RESIZE);
      expect(srcdoc).toContain('postMessage');
    });

    it('should include pluginId in resize message payload', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '', undefined, 'test-plugin-id');
      expect(srcdoc).toContain("pluginId: 'test-plugin-id'");
    });

    it('should include optional custom JS when provided', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '', 'console.log("custom")');
      expect(srcdoc).toContain('console.log("custom")');
    });

    it('should produce valid HTML structure', () => {
      const srcdoc = buildSandboxSrcdoc('<div>test</div>', 'div { color: red; }');
      expect(srcdoc).toContain('<!DOCTYPE html>');
      expect(srcdoc).toContain('<html');
      expect(srcdoc).toContain('<head>');
      expect(srcdoc).toContain('</head>');
      expect(srcdoc).toContain('<body>');
      expect(srcdoc).toContain('</body>');
      expect(srcdoc).toContain('</html>');
    });

    it('should set meta charset utf-8', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '');
      expect(srcdoc).toContain('charset="utf-8"');
    });

    it('should dispatch a custom event when data is received', () => {
      const srcdoc = buildSandboxSrcdoc('<div></div>', '');
      expect(srcdoc).toContain('widget-data-update');
      expect(srcdoc).toContain('CustomEvent');
    });
  });

  describe('SANDBOX_MSG constants', () => {
    it('should export DATA and RESIZE message types', () => {
      expect(SANDBOX_MSG.DATA).toBe('widget-data');
      expect(SANDBOX_MSG.RESIZE).toBe('widget-resize');
    });
  });

  describe('message type interfaces', () => {
    it('SandboxDataMessage should have correct shape', () => {
      const msg: SandboxDataMessage = {
        type: 'widget-data',
        pluginId: 'test-plugin',
        data: { temp: 72 },
      };
      expect(msg.type).toBe(SANDBOX_MSG.DATA);
      expect(msg.pluginId).toBe('test-plugin');
      expect(msg.data).toEqual({ temp: 72 });
    });

    it('SandboxResizeMessage should have correct shape', () => {
      const msg: SandboxResizeMessage = {
        type: 'widget-resize',
        pluginId: 'test-plugin',
        height: 250,
      };
      expect(msg.type).toBe(SANDBOX_MSG.RESIZE);
      expect(msg.pluginId).toBe('test-plugin');
      expect(msg.height).toBe(250);
    });
  });
});
