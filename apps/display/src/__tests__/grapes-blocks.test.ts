import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define the block type that GrapesJS BlockManager.add() expects
interface BlockConfig {
  id: string;
  label: string;
  category?: string;
  content: string;
  attributes?: Record<string, string>;
}

// Mock editor with BlockManager
function createMockEditor() {
  const blocks: BlockConfig[] = [];

  return {
    BlockManager: {
      add: vi.fn((id: string, config: Omit<BlockConfig, 'id'>) => {
        blocks.push({ id, ...config });
      }),
      getAll: () => blocks,
    },
    _blocks: blocks,
  };
}

// We'll import the function under test
let registerWidgetBlocks: (editor: unknown) => void;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import('../lib/grapes-blocks');
  registerWidgetBlocks = mod.registerWidgetBlocks;
});

describe('registerWidgetBlocks', () => {
  let mockEditor: ReturnType<typeof createMockEditor>;

  beforeEach(() => {
    mockEditor = createMockEditor();
  });

  it('registers exactly 7 blocks', () => {
    registerWidgetBlocks(mockEditor);
    expect(mockEditor._blocks).toHaveLength(7);
  });

  it('registers blocks with required IDs', () => {
    registerWidgetBlocks(mockEditor);
    const ids = mockEditor._blocks.map((b) => b.id);

    expect(ids).toContain('widget-text');
    expect(ids).toContain('widget-heading');
    expect(ids).toContain('widget-image');
    expect(ids).toContain('widget-value');
    expect(ids).toContain('widget-list');
    expect(ids).toContain('widget-divider');
    expect(ids).toContain('widget-icon');
  });

  it('each block has a descriptive label', () => {
    registerWidgetBlocks(mockEditor);

    for (const block of mockEditor._blocks) {
      expect(block.label).toBeTruthy();
      expect(typeof block.label).toBe('string');
      expect(block.label.length).toBeGreaterThan(0);
    }
  });

  it('all blocks are categorized under "Widget"', () => {
    registerWidgetBlocks(mockEditor);

    for (const block of mockEditor._blocks) {
      expect(block.category).toBe('Widget');
    }
  });

  it('text block produces a <p> tag', () => {
    registerWidgetBlocks(mockEditor);
    const textBlock = mockEditor._blocks.find((b) => b.id === 'widget-text');

    expect(textBlock).toBeDefined();
    expect(textBlock!.content).toContain('<p');
  });

  it('heading block produces an <h2> tag', () => {
    registerWidgetBlocks(mockEditor);
    const headingBlock = mockEditor._blocks.find((b) => b.id === 'widget-heading');

    expect(headingBlock).toBeDefined();
    expect(headingBlock!.content).toContain('<h2');
  });

  it('image block produces an <img> tag', () => {
    registerWidgetBlocks(mockEditor);
    const imageBlock = mockEditor._blocks.find((b) => b.id === 'widget-image');

    expect(imageBlock).toBeDefined();
    expect(imageBlock!.content).toContain('<img');
  });

  it('value block produces a <span> element', () => {
    registerWidgetBlocks(mockEditor);
    const valueBlock = mockEditor._blocks.find((b) => b.id === 'widget-value');

    expect(valueBlock).toBeDefined();
    expect(valueBlock!.content).toContain('<span');
  });

  it('list block produces a <ul> with <li> items', () => {
    registerWidgetBlocks(mockEditor);
    const listBlock = mockEditor._blocks.find((b) => b.id === 'widget-list');

    expect(listBlock).toBeDefined();
    expect(listBlock!.content).toContain('<ul');
    expect(listBlock!.content).toContain('<li');
  });

  it('divider block produces an <hr> tag', () => {
    registerWidgetBlocks(mockEditor);
    const dividerBlock = mockEditor._blocks.find((b) => b.id === 'widget-divider');

    expect(dividerBlock).toBeDefined();
    expect(dividerBlock!.content).toContain('<hr');
  });

  it('icon block produces an element with icon content', () => {
    registerWidgetBlocks(mockEditor);
    const iconBlock = mockEditor._blocks.find((b) => b.id === 'widget-icon');

    expect(iconBlock).toBeDefined();
    expect(iconBlock!.content).toContain('<span');
  });

  it('blocks include inline styles for dark theme defaults', () => {
    registerWidgetBlocks(mockEditor);

    // Text and heading blocks should have color styling
    const textBlock = mockEditor._blocks.find((b) => b.id === 'widget-text');
    expect(textBlock!.content).toContain('color:');

    const headingBlock = mockEditor._blocks.find((b) => b.id === 'widget-heading');
    expect(headingBlock!.content).toContain('color:');

    // Value block should have large font
    const valueBlock = mockEditor._blocks.find((b) => b.id === 'widget-value');
    expect(valueBlock!.content).toContain('font-size:');
  });

  it('each block has an attributes object with a class for sidebar icon', () => {
    registerWidgetBlocks(mockEditor);

    for (const block of mockEditor._blocks) {
      expect(block.attributes).toBeDefined();
      expect(block.attributes!.class).toBeTruthy();
    }
  });

  it('blocks use semantic HTML elements', () => {
    registerWidgetBlocks(mockEditor);

    const semanticMap: Record<string, string> = {
      'widget-text': '<p',
      'widget-heading': '<h2',
      'widget-image': '<img',
      'widget-list': '<ul',
      'widget-divider': '<hr',
    };

    for (const [id, tag] of Object.entries(semanticMap)) {
      const block = mockEditor._blocks.find((b) => b.id === id);
      expect(block, `Block ${id} should exist`).toBeDefined();
      expect(block!.content, `Block ${id} should contain ${tag}`).toContain(tag);
    }
  });
});

// ── Data Block Registration ─────────────────────────────────────────────────

let registerDataBlocks: (editor: unknown, slots: Array<{ id: string; label: string }>) => void;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import('../lib/grapes-blocks');
  registerWidgetBlocks = mod.registerWidgetBlocks;
  registerDataBlocks = mod.registerDataBlocks;
});

describe('registerDataBlocks', () => {
  let mockEditor: ReturnType<typeof createMockEditor>;

  const testSlots = [
    { id: 'title', label: 'Title' },
    { id: 'value', label: 'Value' },
    { id: 'image', label: 'Image' },
    { id: 'subtitle', label: 'Subtitle' },
  ];

  beforeEach(() => {
    mockEditor = createMockEditor();
  });

  it('registers a data text block for each text-compatible slot', () => {
    registerDataBlocks(mockEditor, testSlots);
    const ids = mockEditor._blocks.map((b) => b.id);

    expect(ids).toContain('data-text-title');
    expect(ids).toContain('data-text-value');
    expect(ids).toContain('data-text-subtitle');
  });

  it('registers a data image block for image slot', () => {
    registerDataBlocks(mockEditor, testSlots);
    const ids = mockEditor._blocks.map((b) => b.id);

    expect(ids).toContain('data-image-image');
  });

  it('registers a data list block', () => {
    registerDataBlocks(mockEditor, testSlots);
    const ids = mockEditor._blocks.map((b) => b.id);

    expect(ids).toContain('data-list');
  });

  it('data text blocks contain {{slot_id}} template placeholder', () => {
    registerDataBlocks(mockEditor, testSlots);
    const titleBlock = mockEditor._blocks.find((b) => b.id === 'data-text-title');

    expect(titleBlock).toBeDefined();
    expect(titleBlock!.content).toContain('{{title}}');
  });

  it('data image block has src with {{slot_id}} template', () => {
    registerDataBlocks(mockEditor, testSlots);
    const imageBlock = mockEditor._blocks.find((b) => b.id === 'data-image-image');

    expect(imageBlock).toBeDefined();
    expect(imageBlock!.content).toContain('{{image}}');
    expect(imageBlock!.content).toContain('<img');
  });

  it('data list block contains list template', () => {
    registerDataBlocks(mockEditor, testSlots);
    const listBlock = mockEditor._blocks.find((b) => b.id === 'data-list');

    expect(listBlock).toBeDefined();
    expect(listBlock!.content).toContain('<ul');
    expect(listBlock!.content).toContain('<li');
    expect(listBlock!.content).toContain('{{item}}');
  });

  it('all data blocks are categorized under "Data"', () => {
    registerDataBlocks(mockEditor, testSlots);

    for (const block of mockEditor._blocks) {
      expect(block.category).toBe('Data');
    }
  });

  it('data blocks include data-slot attribute for binding', () => {
    registerDataBlocks(mockEditor, testSlots);
    const titleBlock = mockEditor._blocks.find((b) => b.id === 'data-text-title');

    expect(titleBlock!.content).toContain('data-slot="title"');
  });

  it('data text placeholders have visually distinct styling', () => {
    registerDataBlocks(mockEditor, testSlots);
    const titleBlock = mockEditor._blocks.find((b) => b.id === 'data-text-title');

    // Should have highlighted background for visual distinction
    expect(titleBlock!.content).toContain('background');
  });

  it('each data block has a descriptive label', () => {
    registerDataBlocks(mockEditor, testSlots);

    const titleBlock = mockEditor._blocks.find((b) => b.id === 'data-text-title');
    expect(titleBlock!.label).toContain('Title');

    const imageBlock = mockEditor._blocks.find((b) => b.id === 'data-image-image');
    expect(imageBlock!.label).toContain('Image');
  });

  it('each data block has an attributes object with a class', () => {
    registerDataBlocks(mockEditor, testSlots);

    for (const block of mockEditor._blocks) {
      expect(block.attributes).toBeDefined();
      expect(block.attributes!.class).toBeTruthy();
    }
  });

  it('handles empty slots array gracefully', () => {
    registerDataBlocks(mockEditor, []);
    // Should still have the data-list block
    expect(mockEditor._blocks).toHaveLength(1);
    expect(mockEditor._blocks[0].id).toBe('data-list');
  });

  it('handles single slot correctly', () => {
    registerDataBlocks(mockEditor, [{ id: 'name', label: 'Name' }]);
    const ids = mockEditor._blocks.map((b) => b.id);

    expect(ids).toContain('data-text-name');
    expect(ids).toContain('data-list');
    expect(mockEditor._blocks).toHaveLength(2);
  });
});
