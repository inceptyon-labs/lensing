import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStyleManager } from '../lib/grapes-style-manager';

/** Mock GrapesJS StyleManager API */
interface MockStyleManager {
  addProperty: (section: string, config: Record<string, unknown>) => void;
  addSector: (id: string, config: { label: string }) => void;
}

interface MockEditor {
  StyleManager: MockStyleManager;
}

describe('GrapesJS Style Manager Configuration', () => {
  let mockEditor: MockEditor;
  let properties: Array<{ name: string; section?: string; [key: string]: unknown }> = [];
  let sectors: Array<{ id: string; label: string }> = [];

  beforeEach(() => {
    properties = [];
    sectors = [];
    mockEditor = {
      StyleManager: {
        addSector: vi.fn((id: string, config: { label: string }) => {
          sectors.push({ id, ...config });
        }),
        addProperty: vi.fn((section: string, config: Record<string, unknown>) => {
          properties.push({ ...config, section } as any);
        }),
      },
    };
  });

  it('should configure style manager without error', () => {
    expect(() => configureStyleManager(mockEditor as any)).not.toThrow();
  });

  describe('Color pickers', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should have text color picker property', () => {
      const textColor = properties.find(
        (p) => p.name === 'color' && p.section === 'general'
      );
      expect(textColor).toBeDefined();
      expect(textColor?.type).toBe('color');
      expect(textColor?.label).toBe('Text Color');
    });

    it('should have background color picker property', () => {
      const bgColor = properties.find(
        (p) => p.name === 'background-color' && p.section === 'general'
      );
      expect(bgColor).toBeDefined();
      expect(bgColor?.type).toBe('color');
      expect(bgColor?.label).toBe('Background Color');
    });

    it('should have border color picker property', () => {
      const borderColor = properties.find(
        (p) => p.name === 'border-color' && p.section === 'general'
      );
      expect(borderColor).toBeDefined();
      expect(borderColor?.type).toBe('color');
      expect(borderColor?.label).toBe('Border Color');
    });

    it('should set text color default to starlight token', () => {
      const textColor = properties.find((p) => p.name === 'color');
      expect(textColor?.defaults).toContain('var(--starlight');
    });
  });

  describe('Font family selector', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should have font-family select property', () => {
      const fontFamily = properties.find((p) => p.name === 'font-family');
      expect(fontFamily).toBeDefined();
      expect(fontFamily?.type).toBe('select');
      expect(fontFamily?.label).toBe('Font Family');
    });

    it('should include Inter font option', () => {
      const fontFamily = properties.find((p) => p.name === 'font-family') as any;
      expect(fontFamily?.options).toBeDefined();
      const interOption = (fontFamily?.options || []).find((opt: any) =>
        opt.value?.includes('Inter')
      );
      expect(interOption).toBeDefined();
    });

    it('should include JetBrains Mono font option', () => {
      const fontFamily = properties.find((p) => p.name === 'font-family') as any;
      const monoOption = (fontFamily?.options || []).find((opt: any) =>
        opt.value?.includes('JetBrains Mono')
      );
      expect(monoOption).toBeDefined();
    });

    it('should set Inter as default font', () => {
      const fontFamily = properties.find((p) => p.name === 'font-family');
      expect(fontFamily?.defaults).toContain('Inter');
    });
  });

  describe('Typography controls', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should have font-size property with slider', () => {
      const fontSize = properties.find((p) => p.name === 'font-size');
      expect(fontSize).toBeDefined();
      expect(fontSize?.type).toBe('slider');
      expect(fontSize?.label).toBe('Font Size');
    });

    it('should have font-weight select property', () => {
      const fontWeight = properties.find((p) => p.name === 'font-weight');
      expect(fontWeight).toBeDefined();
      expect(fontWeight?.type).toBe('select');
      expect(fontWeight?.label).toBe('Font Weight');
    });

    it('should include all design system font weights', () => {
      const fontWeight = properties.find((p) => p.name === 'font-weight') as any;
      const weights = (fontWeight?.options || []).map((opt: any) => opt.value);
      expect(weights).toContain('400');
      expect(weights).toContain('500');
      expect(weights).toContain('600');
      expect(weights).toContain('700');
    });

    it('should have text-align property', () => {
      const textAlign = properties.find((p) => p.name === 'text-align');
      expect(textAlign).toBeDefined();
      expect(textAlign?.type).toBe('select');
      expect(textAlign?.label).toBe('Text Alignment');
    });

    it('should include left, center, right alignment options', () => {
      const textAlign = properties.find((p) => p.name === 'text-align') as any;
      const alignments = (textAlign?.options || []).map((opt: any) => opt.value);
      expect(alignments).toContain('left');
      expect(alignments).toContain('center');
      expect(alignments).toContain('right');
    });
  });

  describe('Spacing controls', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should have padding property with slider', () => {
      const padding = properties.find((p) => p.name === 'padding');
      expect(padding).toBeDefined();
      expect(padding?.type).toBe('slider');
      expect(padding?.label).toBe('Padding');
    });

    it('should have margin property with slider', () => {
      const margin = properties.find((p) => p.name === 'margin');
      expect(margin).toBeDefined();
      expect(margin?.type).toBe('slider');
      expect(margin?.label).toBe('Margin');
    });

    it('should allow 0-32px spacing range', () => {
      const padding = properties.find((p) => p.name === 'padding') as any;
      expect(padding?.min).toBe(0);
      expect(padding?.max).toBeGreaterThanOrEqual(32);
      expect(padding?.step).toBe(4);
    });

    it('should set padding default to 0', () => {
      const padding = properties.find((p) => p.name === 'padding');
      expect(padding?.defaults).toBe(0);
    });
  });

  describe('Border radius control', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should have border-radius property', () => {
      const borderRadius = properties.find((p) => p.name === 'border-radius');
      expect(borderRadius).toBeDefined();
      expect(borderRadius?.type).toBe('select');
      expect(borderRadius?.label).toBe('Border Radius');
    });

    it('should include design system radius options', () => {
      const borderRadius = properties.find((p) => p.name === 'border-radius') as any;
      const radii = (borderRadius?.options || []).map((opt: any) => opt.value);
      expect(radii).toContain('4px');
      expect(radii).toContain('8px');
      expect(radii).toContain('12px');
      expect(radii).toContain('16px');
    });

    it('should set border-radius default to 8px (--radius-md)', () => {
      const borderRadius = properties.find((p) => p.name === 'border-radius');
      expect(borderRadius?.defaults).toContain('8px');
    });
  });

  describe('Opacity control', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should have opacity property with slider', () => {
      const opacity = properties.find((p) => p.name === 'opacity');
      expect(opacity).toBeDefined();
      expect(opacity?.type).toBe('slider');
      expect(opacity?.label).toBe('Opacity');
    });

    it('should allow 0.0-1.0 opacity range', () => {
      const opacity = properties.find((p) => p.name === 'opacity') as any;
      expect(opacity?.min).toBe(0);
      expect(opacity?.max).toBe(1);
      expect(opacity?.step).toBe(0.1);
    });

    it('should set opacity default to 1.0', () => {
      const opacity = properties.find((p) => p.name === 'opacity');
      expect(opacity?.defaults).toBe(1);
    });
  });

  describe('Sector organization', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should create sectors for property organization', () => {
      expect(sectors.length).toBeGreaterThan(0);
    });

    it('should have general sector for colors', () => {
      expect(sectors.find((s) => s.id === 'general')).toBeDefined();
    });

    it('should have typography sector for font controls', () => {
      expect(sectors.find((s) => s.id === 'typography')).toBeDefined();
    });

    it('should have spacing sector for padding/margin', () => {
      expect(sectors.find((s) => s.id === 'spacing')).toBeDefined();
    });
  });

  describe('Dark theme defaults', () => {
    beforeEach(() => {
      configureStyleManager(mockEditor as any);
    });

    it('should initialize with dark display theme values', () => {
      const textColor = properties.find((p) => p.name === 'color');
      const bgColor = properties.find((p) => p.name === 'background-color');

      expect(textColor?.defaults).toContain('starlight');
      expect(bgColor?.defaults).toContain('void');
    });

    it('should use design system CSS variables for defaults', () => {
      const color = properties.find((p) => p.name === 'color');
      expect(color?.defaults).toMatch(/var\(--/);
    });
  });
});
