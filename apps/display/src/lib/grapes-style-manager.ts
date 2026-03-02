/**
 * GrapesJS style manager configuration for widget customization.
 * Sets up color pickers, typography, spacing, and layout controls
 * aligned with the lensing dark display design system.
 */

interface GrapesEditor {
  StyleManager: {
    addSector(id: string, config: { label: string }): void;
    addProperty(section: string, config: Record<string, unknown>): void;
  };
}

/**
 * Configure the GrapesJS style manager with widget-customization controls.
 * Establishes sectors (general, typography, spacing) and registers properties
 * with design system defaults.
 */
export function configureStyleManager(editor: GrapesEditor): void {
  const sm = editor.StyleManager;

  // ── Sectors ──────────────────────────────────────────────────────────────
  sm.addSector('general', { label: 'Colors' });
  sm.addSector('typography', { label: 'Typography' });
  sm.addSector('spacing', { label: 'Spacing & Shape' });

  // ── General: Color pickers ────────────────────────────────────────────────
  sm.addProperty('general', {
    name: 'color',
    label: 'Text Color',
    type: 'color',
    defaults: 'var(--starlight, hsl(220, 15%, 90%))',
  });

  sm.addProperty('general', {
    name: 'background-color',
    label: 'Background Color',
    type: 'color',
    defaults: 'var(--void, hsl(240, 8%, 4%))',
  });

  sm.addProperty('general', {
    name: 'border-color',
    label: 'Border Color',
    type: 'color',
    defaults: 'var(--edge, hsla(220, 10%, 50%, 0.12))',
  });

  // ── Typography: Font family ───────────────────────────────────────────────
  sm.addProperty('typography', {
    name: 'font-family',
    label: 'Font Family',
    type: 'select',
    defaults: 'Inter, system-ui, -apple-system, sans-serif',
    options: [
      { value: 'Inter, system-ui, -apple-system, sans-serif', name: 'Inter' },
      {
        value: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
        name: 'JetBrains Mono',
      },
    ],
  });

  // ── Typography: Size and weight ────────────────────────────────────────────
  sm.addProperty('typography', {
    name: 'font-size',
    label: 'Font Size',
    type: 'slider',
    defaults: 16,
    min: 12,
    max: 48,
    step: 2,
    units: ['px'],
  });

  sm.addProperty('typography', {
    name: 'font-weight',
    label: 'Font Weight',
    type: 'select',
    defaults: '400',
    options: [
      { value: '400', name: 'Regular (400)' },
      { value: '500', name: 'Medium (500)' },
      { value: '600', name: 'Semi Bold (600)' },
      { value: '700', name: 'Bold (700)' },
    ],
  });

  // ── Typography: Alignment ─────────────────────────────────────────────────
  sm.addProperty('typography', {
    name: 'text-align',
    label: 'Text Alignment',
    type: 'select',
    defaults: 'left',
    options: [
      { value: 'left', name: 'Left' },
      { value: 'center', name: 'Center' },
      { value: 'right', name: 'Right' },
    ],
  });

  // ── Spacing: Padding ──────────────────────────────────────────────────────
  sm.addProperty('spacing', {
    name: 'padding',
    label: 'Padding',
    type: 'slider',
    defaults: 0,
    min: 0,
    max: 64,
    step: 4,
    units: ['px'],
  });

  // ── Spacing: Margin ────────────────────────────────────────────────────────
  sm.addProperty('spacing', {
    name: 'margin',
    label: 'Margin',
    type: 'slider',
    defaults: 0,
    min: 0,
    max: 64,
    step: 4,
    units: ['px'],
  });

  // ── Shape: Border radius ─────────────────────────────────────────────────
  sm.addProperty('spacing', {
    name: 'border-radius',
    label: 'Border Radius',
    type: 'select',
    defaults: '8px',
    options: [
      { value: '0', name: 'None' },
      { value: '4px', name: 'Small (4px)' },
      { value: '8px', name: 'Medium (8px)' },
      { value: '12px', name: 'Large (12px)' },
      { value: '16px', name: 'XL (16px)' },
    ],
  });

  // ── Effects: Opacity ──────────────────────────────────────────────────────
  sm.addProperty('spacing', {
    name: 'opacity',
    label: 'Opacity',
    type: 'slider',
    defaults: 1,
    min: 0,
    max: 1,
    step: 0.1,
  });
}
