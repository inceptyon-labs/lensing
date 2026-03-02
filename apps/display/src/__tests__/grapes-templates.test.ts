import { describe, it, expect, beforeAll } from 'vitest';
import { WIDGET_TEMPLATES } from '../lib/grapes-templates';
import type { WidgetTemplate } from '../lib/grapes-templates';

describe('Widget layout templates', () => {
  it('should export an array of 5 templates', () => {
    expect(WIDGET_TEMPLATES).toHaveLength(5);
  });

  it('should give each template a unique ID', () => {
    const ids = WIDGET_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(5);
  });

  it('each template should have id, name, description, html, css', () => {
    for (const t of WIDGET_TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.html).toBeTruthy();
      expect(t.css).toBeTruthy();
    }
  });

  describe('Single Value template', () => {
    let tmpl: WidgetTemplate;
    beforeAll(() => {
      tmpl = WIDGET_TEMPLATES.find((t) => t.id === 'single-value')!;
    });

    it('should exist', () => {
      expect(tmpl).toBeDefined();
    });

    it('should contain {{value}} placeholder', () => {
      expect(tmpl.html).toContain('{{value}}');
    });

    it('should contain {{label}} placeholder', () => {
      expect(tmpl.html).toContain('{{label}}');
    });
  });

  describe('List template', () => {
    let tmpl: WidgetTemplate;
    beforeAll(() => {
      tmpl = WIDGET_TEMPLATES.find((t) => t.id === 'list')!;
    });

    it('should exist', () => {
      expect(tmpl).toBeDefined();
    });

    it('should contain {{title}} placeholder', () => {
      expect(tmpl.html).toContain('{{title}}');
    });

    it('should contain {{item}} placeholder', () => {
      expect(tmpl.html).toContain('{{item}}');
    });
  });

  describe('Key-Value Grid template', () => {
    let tmpl: WidgetTemplate;
    beforeAll(() => {
      tmpl = WIDGET_TEMPLATES.find((t) => t.id === 'key-value-grid')!;
    });

    it('should exist', () => {
      expect(tmpl).toBeDefined();
    });

    it('should contain label and value placeholders', () => {
      expect(tmpl.html).toContain('{{label_1}}');
      expect(tmpl.html).toContain('{{value_1}}');
    });
  });

  describe('Image + Caption template', () => {
    let tmpl: WidgetTemplate;
    beforeAll(() => {
      tmpl = WIDGET_TEMPLATES.find((t) => t.id === 'image-caption')!;
    });

    it('should exist', () => {
      expect(tmpl).toBeDefined();
    });

    it('should contain {{image_url}} placeholder', () => {
      expect(tmpl.html).toContain('{{image_url}}');
    });

    it('should contain {{caption}} placeholder', () => {
      expect(tmpl.html).toContain('{{caption}}');
    });
  });

  describe('Card template', () => {
    let tmpl: WidgetTemplate;
    beforeAll(() => {
      tmpl = WIDGET_TEMPLATES.find((t) => t.id === 'card')!;
    });

    it('should exist', () => {
      expect(tmpl).toBeDefined();
    });

    it('should contain {{title}} and {{value}} placeholders', () => {
      expect(tmpl.html).toContain('{{title}}');
      expect(tmpl.html).toContain('{{value}}');
    });

    it('should contain {{subtitle}} placeholder', () => {
      expect(tmpl.html).toContain('{{subtitle}}');
    });
  });

  describe('Dark theme defaults', () => {
    it('all templates should reference --starlight or --event-horizon CSS vars', () => {
      for (const t of WIDGET_TEMPLATES) {
        const combined = t.html + t.css;
        const hasStarlight = combined.includes('--starlight');
        const hasEventHorizon = combined.includes('--event-horizon');
        expect(hasStarlight || hasEventHorizon).toBe(true);
      }
    });
  });
});
