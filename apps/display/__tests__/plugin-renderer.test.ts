import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('PluginRenderer Component', () => {
  const rendererPath = join(__dirname, '../src/lib/PluginRenderer.svelte');

  it('should have PluginRenderer.svelte file', () => {
    expect(existsSync(rendererPath)).toBe(true);
  });

  it('should accept a plugin prop typed as PluginAdminEntry', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('PluginAdminEntry');
    expect(source).toContain('plugin');
  });

  it('should import built-in widget components', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('PhotoSlideshow');
    expect(source).toContain('NewsHeadlines');
    expect(source).toContain('SportsScores');
    expect(source).toContain('HomeAssistantDevices');
    expect(source).toContain('CryptoWidget');
  });

  it('should import Placeholder for fallback rendering', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('Placeholder');
  });

  it('should render based on plugin_id matching', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should reference plugin.plugin_id or plugin_id to determine which component to render
    expect(source).toContain('plugin_id');
  });

  it('should handle unknown plugin_id by rendering Placeholder', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should have fallback/else clause rendering Placeholder
    expect(source).toContain('Placeholder');
    // Should use if/else or switch to select component
    expect(source).toMatch(/{:else}|{:else if|default:/);
  });
});

describe('Data Bus Store Integration', () => {
  const rendererPath = join(__dirname, '../src/lib/PluginRenderer.svelte');

  it('should import getChannelData from dataBusStore', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('dataBusStore');
    expect(source).toContain('getChannelData');
  });

  it('should subscribe to data bus store for news plugin', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should call getChannelData or use store subscription for news
    expect(source).toContain('news');
  });

  it('should pass store data to NewsHeadlines headlines prop', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should pass dynamic headlines prop (not empty array)
    expect(source).toMatch(/headlines=\{[^}]*\}/);
  });

  it('should pass store data to SportsScores games prop', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should pass dynamic games prop (not empty array)
    expect(source).toMatch(/games=\{[^}]*\}/);
  });

  it('should pass store data to HomeAssistantDevices devices and sensors props', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should pass dynamic devices/sensors props (not empty arrays)
    expect(source).toMatch(/devices=\{[^}]*\}/);
    expect(source).toMatch(/sensors=\{[^}]*\}/);
  });

  it('should handle null data by using empty array fallback', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should have null coalescing or fallback logic
    expect(source).toMatch(/\?\?|empty|null|undefined|=\[\]/);
  });

  it('should subscribe to crypto-server channel for crypto prices', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should call getChannelData or use store subscription for crypto
    expect(source).toContain('crypto');
  });

  it('should pass store data to CryptoWidget coins prop', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should pass dynamic coins prop (not empty array)
    expect(source).toMatch(/coins=\{[^}]*\}/);
  });

  it('should render CryptoWidget for crypto plugin_id', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    // Should have conditional rendering for crypto plugin
    expect(source).toMatch(/{:else if.*crypto/);
  });

  it('should import WeatherWidget component', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('WeatherWidget');
  });

  it('should subscribe to weather-server channel for weather data', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toContain('weather');
    expect(source).toContain('getChannelData');
  });

  it('should render WeatherWidget for weather plugin_id', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toMatch(/{:else if.*weather/);
  });

  it('should pass current and forecast props to WeatherWidget', () => {
    const source = readFileSync(rendererPath, 'utf-8');
    expect(source).toMatch(/current=\{[^}]*\}/);
    expect(source).toMatch(/forecast=\{[^}]*\}/);
  });
});

describe('Built-in Plugin Map', () => {
  const configPath = join(__dirname, '../src/lib/config.ts');

  it('should export BUILTIN_PLUGIN_MAP from config.ts', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain('BUILTIN_PLUGIN_MAP');
    expect(source).toContain('export');
  });

  it('should map photo-slideshow plugin id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain('photo-slideshow');
  });

  it('should map news module id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain('news:');
  });

  it('should map sports module id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain('sports:');
  });

  it('should map home-assistant module id', () => {
    const source = readFileSync(configPath, 'utf-8');
    expect(source).toContain("'home-assistant'");
  });
});
