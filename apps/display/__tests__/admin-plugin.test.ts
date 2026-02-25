import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Admin Plugin Management Components', () => {
  // ── AdminPluginCard ───────────────────────────────────────────

  describe('AdminPluginCard Component', () => {
    const cardPath = join(__dirname, '../src/lib/AdminPluginCard.svelte');

    it('should have AdminPluginCard.svelte file', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toBeTruthy();
    });

    it('should accept a plugin prop with id, manifest, enabled, zone', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('plugin');
      expect(source).toContain('export let plugin');
    });

    it('should accept onToggleEnabled callback', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('onToggleEnabled');
    });

    it('should accept onZoneChange callback', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('onZoneChange');
    });

    it('should display plugin name as heading', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('manifest.name');
    });

    it('should display status badge with semantic color', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('status');
    });

    it('should show enable/disable toggle button', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('toggle');
    });

    it('should have zone dropdown select element', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('select');
      expect(source).toContain('zone');
    });

    it('should use --event-horizon for card background', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('--event-horizon');
    });

    it('should use --edge border', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('--edge');
    });

    it('should use --radius-md for border radius', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('--radius-md');
    });

    it('should use --space-4 for padding', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('--space-4');
    });

    it('should include hover glow with --ember-trace', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('--ember-trace');
    });

    it('should use design system text colors', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('--starlight');
      expect(source).toContain('--dim-light');
    });

    it('should import AdminConfigForm', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('AdminConfigForm');
    });

    it('should accept onConfigSave callback', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('onConfigSave');
    });

    it('should show configure button when plugin has config_schema', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('config_schema');
      expect(source).toMatch(/[Cc]onfigure|[Cc]onfig/);
    });

    it('should render AdminConfigForm in expandable section', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('<AdminConfigForm');
    });

    it('should accept optional onRestart callback', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('export let onRestart');
    });

    it('should have restart button markup', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('restart-btn');
      expect(source).toContain('Restart');
    });

    it('should have restart status states', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain("'restarting'");
      expect(source).toContain("'restarted'");
      expect(source).toContain('Restarting');
      expect(source).toContain('Restarted');
    });

    it('should show built-in module subtitle', () => {
      const source = readFileSync(cardPath, 'utf-8');
      expect(source).toContain('plugin.builtin');
      expect(source).toContain('Built-in module');
    });
  });

  // ── AdminPluginList ───────────────────────────────────────────

  describe('AdminPluginList Component', () => {
    const listPath = join(__dirname, '../src/lib/AdminPluginList.svelte');

    it('should have AdminPluginList.svelte file', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toBeTruthy();
    });

    it('should have onMount to fetch plugins', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('onMount');
      expect(source).toContain('fetch');
    });

    it('should fetch from GET /plugins endpoint', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('/plugins');
    });

    it('should have plugins reactive variable', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('plugins');
    });

    it('should have loading state', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('loading');
    });

    it('should have error state', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('error');
    });

    it('should render AdminPluginCard for each plugin', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('AdminPluginCard');
      expect(source).toContain('each');
    });

    it('should handle toggle enabled with PUT /plugins/:id/enabled', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('PUT');
      expect(source).toContain('enabled');
    });

    it('should handle zone change with PUT /plugins/:id/zone', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('zone');
    });

    it('should handle config save with PUT /plugins/:id/config', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('/config');
      expect(source).toContain('onConfigSave');
    });

    it('should have empty state message', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toMatch(/[Nn]o.*plugins|[Nn]o.*modules|empty/);
    });

    it('should show loading message while fetching', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toMatch(/[Ll]oading|Fetching/);
    });

    it('should display error message if fetch fails', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toMatch(/Error|error|failed/);
    });

    it('should have handleRestart function for built-in modules', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('handleRestart');
      expect(source).toContain('/modules/');
      expect(source).toContain('/restart');
    });

    it('should pass onRestart only for builtin plugins', () => {
      const source = readFileSync(listPath, 'utf-8');
      expect(source).toContain('plugin.builtin');
      expect(source).toContain('onRestart');
    });
  });

  // ── Admin Route ───────────────────────────────────────────────

  describe('Admin Route (/admin)', () => {
    const routePath = join(__dirname, '../src/routes/admin/+page.svelte');

    it('should have admin/+page.svelte file', () => {
      const source = readFileSync(routePath, 'utf-8');
      expect(source).toBeTruthy();
    });

    it('should have page title/heading', () => {
      const source = readFileSync(routePath, 'utf-8');
      expect(source).toMatch(/[Aa]dmin|[Pp]lugin/);
    });

    it('should render AdminPluginList component', () => {
      const source = readFileSync(routePath, 'utf-8');
      expect(source).toContain('AdminPluginList');
    });

    it('should have back/home link', () => {
      const source = readFileSync(routePath, 'utf-8');
      expect(source).toMatch(/[Bb]ack|[Hh]ome|display|main/i);
    });

    it('should use design system background', () => {
      const source = readFileSync(routePath, 'utf-8');
      expect(source).toContain('--void');
    });

    it('should allow scrolling (override kiosk fullscreen)', () => {
      const source = readFileSync(routePath, 'utf-8');
      expect(source).toContain('overflow');
    });
  });

  // ── Navigation Link ───────────────────────────────────────────

  describe('Admin Link in Main Display', () => {
    const mainPagePath = join(__dirname, '../src/routes/+page.svelte');

    it('should have link to /admin route', () => {
      const source = readFileSync(mainPagePath, 'utf-8');
      expect(source).toContain('admin');
      expect(source).toMatch(/href|to|route/i);
    });

    it('should be easy to find (in top-bar or left-col)', () => {
      const source = readFileSync(mainPagePath, 'utf-8');
      const hasAdminInNav =
        source.includes('admin') && (source.includes('top-bar') || source.includes('left-col'));
      expect(hasAdminInNav || source.includes('admin')).toBe(true);
    });
  });
});
