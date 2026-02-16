import { describe, it, expect } from 'vitest';
import type {
  PluginManifest,
  PluginPermissions,
  ZoneName,
  NotificationPriority,
  SceneName,
  DataBusMessage,
  PluginInstance,
  WidgetSize,
} from '@lensing/types';

describe('@lensing/types', () => {
  it('exports PluginManifest type with required fields', () => {
    const manifest: PluginManifest = {
      id: 'weather',
      name: 'Weather',
      version: '1.0.0',
    };
    expect(manifest.id).toBe('weather');
    expect(manifest.name).toBe('Weather');
    expect(manifest.version).toBe('1.0.0');
  });

  it('exports PluginManifest with optional fields', () => {
    const manifest: PluginManifest = {
      id: 'weather',
      name: 'Weather',
      version: '1.0.0',
      ui_entry: './dist/widget.js',
      server_entry: './dist/server.js',
      permissions: {
        allowed_domains: ['api.openweathermap.org'],
        max_refresh_ms: 60000,
        secrets: ['WEATHER_API_KEY'],
      },
      widget_sizes: ['small', 'medium', 'large'],
      dependencies: ['calendar'],
    };
    expect(manifest.ui_entry).toBe('./dist/widget.js');
    expect(manifest.permissions?.allowed_domains).toContain('api.openweathermap.org');
    expect(manifest.dependencies).toContain('calendar');
  });

  it('exports ZoneName type with valid zone names', () => {
    const zones: ZoneName[] = ['top-bar', 'left-col', 'center', 'right-col', 'bottom-bar'];
    expect(zones).toHaveLength(5);
  });

  it('exports NotificationPriority type', () => {
    const priorities: NotificationPriority[] = ['info', 'warning', 'urgent'];
    expect(priorities).toHaveLength(3);
  });

  it('exports SceneName type', () => {
    const scenes: SceneName[] = ['morning', 'evening', 'ambient', 'focus', 'alert'];
    expect(scenes).toHaveLength(5);
  });

  it('exports DataBusMessage with generic type', () => {
    const msg: DataBusMessage<{ temp: number }> = {
      channel: 'weather.current',
      data: { temp: 72 },
      timestamp: new Date().toISOString(),
      plugin_id: 'weather',
    };
    expect(msg.channel).toBe('weather.current');
    expect(msg.data.temp).toBe(72);
  });

  it('exports PluginInstance with all fields', () => {
    const instance: PluginInstance = {
      id: 'weather',
      manifest: { id: 'weather', name: 'Weather', version: '1.0.0' },
      status: 'active',
      last_refresh: new Date().toISOString(),
    };
    expect(instance.status).toBe('active');
  });

  it('exports WidgetSize type', () => {
    const sizes: WidgetSize[] = ['small', 'medium', 'large'];
    expect(sizes).toHaveLength(3);
  });
});
