/**
 * Custom block palette for GrapesJS display widgets.
 * Registers 7 constrained blocks with dark-theme defaults.
 */

interface GrapesEditor {
  BlockManager: {
    add(id: string, config: BlockConfig): void;
  };
}

interface BlockConfig {
  label: string;
  category: string;
  content: string;
  attributes: { class: string };
}

/**
 * Register custom widget blocks on the GrapesJS editor.
 * Replaces default blocks with a constrained set suitable for display widgets.
 */
export function registerWidgetBlocks(editor: unknown): void {
  const ed = editor as GrapesEditor;

  ed.BlockManager.add('widget-text', {
    label: 'Text',
    category: 'Widget',
    content:
      '<p style="color: var(--starlight, #e2e4ed); font-size: 16px; margin: 0; line-height: 1.5;">Enter text here</p>',
    attributes: { class: 'fa fa-text-width' },
  });

  ed.BlockManager.add('widget-heading', {
    label: 'Heading',
    category: 'Widget',
    content:
      '<h2 style="color: var(--starlight, #e2e4ed); font-size: 24px; font-weight: 700; margin: 0; line-height: 1.2;">Heading</h2>',
    attributes: { class: 'fa fa-header' },
  });

  ed.BlockManager.add('widget-image', {
    label: 'Image',
    category: 'Widget',
    content: '<img src="" alt="" style="max-width: 100%; height: auto; display: block;" />',
    attributes: { class: 'fa fa-image' },
  });

  ed.BlockManager.add('widget-value', {
    label: 'Value',
    category: 'Widget',
    content:
      '<span style="color: var(--starlight, #e2e4ed); font-size: 48px; font-weight: 700; display: block; line-height: 1;">42</span>',
    attributes: { class: 'fa fa-tachometer' },
  });

  ed.BlockManager.add('widget-list', {
    label: 'List',
    category: 'Widget',
    content:
      '<ul style="color: var(--starlight, #e2e4ed); font-size: 16px; margin: 0; padding-left: 20px; list-style-type: disc;"><li>Item one</li><li>Item two</li><li>Item three</li></ul>',
    attributes: { class: 'fa fa-list' },
  });

  ed.BlockManager.add('widget-divider', {
    label: 'Divider',
    category: 'Widget',
    content:
      '<hr style="border: none; border-top: 1px solid var(--edge, rgba(140,145,160,0.12)); margin: 8px 0;" />',
    attributes: { class: 'fa fa-minus' },
  });

  ed.BlockManager.add('widget-icon', {
    label: 'Icon',
    category: 'Widget',
    content:
      '<span style="color: var(--dim-light, #909bb8); font-size: 24px; display: inline-block; line-height: 1;">★</span>',
    attributes: { class: 'fa fa-star' },
  });
}

/**
 * Register data-bound blocks for each connector slot.
 * Creates text, image, and list blocks that use {{slot_id}} template placeholders.
 */
export function registerDataBlocks(
  editor: unknown,
  slots: Array<{ id: string; label: string }>
): void {
  const ed = editor as GrapesEditor;

  for (const slot of slots) {
    if (slot.id.includes('image')) {
      ed.BlockManager.add(`data-image-${slot.id}`, {
        label: `${slot.label} (Image)`,
        category: 'Data',
        content: `<img data-slot="${slot.id}" src="{{${slot.id}}}" alt="${slot.label}" style="max-width: 100%; height: auto; display: block;" />`,
        attributes: { class: 'fa fa-image' },
      });
    } else {
      ed.BlockManager.add(`data-text-${slot.id}`, {
        label: `${slot.label} (Text)`,
        category: 'Data',
        content: `<span data-slot="${slot.id}" style="color: var(--starlight, #e2e4ed); font-size: 16px; background: rgba(99,179,237,0.15); padding: 2px 4px; border-radius: 3px; display: inline-block;">{{${slot.id}}}</span>`,
        attributes: { class: 'fa fa-database' },
      });
    }
  }

  ed.BlockManager.add('data-list', {
    label: 'Data List',
    category: 'Data',
    content:
      '<ul style="color: var(--starlight, #e2e4ed); font-size: 16px; margin: 0; padding-left: 20px; list-style-type: disc;"><li style="background: rgba(99,179,237,0.15);">{{item}}</li></ul>',
    attributes: { class: 'fa fa-list' },
  });
}
