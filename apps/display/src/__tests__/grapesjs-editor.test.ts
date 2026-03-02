import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';

/** Minimal GrapesJS mock editor */
function createMockEditor(html = '<div></div>', css = 'div {}') {
  const listeners: Record<string, Array<() => void>> = {};
  const registeredBlocks: string[] = [];
  const registeredProperties: Array<{ section: string; name: string }> = [];
  const sectors: string[] = [];
  const canvasDimensions = { width: 300, height: 225 };

  return {
    on: vi.fn((event: string, cb: () => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    }),
    getHtml: vi.fn(() => html),
    getCss: vi.fn(() => css),
    destroy: vi.fn(),
    BlockManager: {
      add: vi.fn((id: string) => {
        registeredBlocks.push(id);
      }),
    },
    StyleManager: {
      addSector: vi.fn((id: string) => {
        sectors.push(id);
      }),
      addProperty: vi.fn((section: string, config: Record<string, unknown>) => {
        registeredProperties.push({ section, name: config.name as string });
      }),
    },
    Canvas: {
      setDimensions: vi.fn((dims: { width: number; height: number }) => {
        canvasDimensions.width = dims.width;
        canvasDimensions.height = dims.height;
      }),
    },
    /** Test helper: emit a registered event */
    emit(event: string) {
      for (const cb of listeners[event] ?? []) cb();
    },
    _listeners: listeners,
    _blocks: registeredBlocks,
    _properties: registeredProperties,
    _sectors: sectors,
    _canvasDimensions: canvasDimensions,
  };
}

let mockEditor: ReturnType<typeof createMockEditor>;

vi.mock('grapesjs', () => ({
  default: {
    init: vi.fn(() => mockEditor),
  },
}));

// Dynamically import after mock is set up
async function renderEditor(props: Record<string, unknown> = {}) {
  const { default: GrapesJSEditor } = await import('../lib/GrapesJSEditor.svelte');
  return render(GrapesJSEditor, { props });
}

describe('GrapesJSEditor onChange', () => {
  beforeEach(() => {
    mockEditor = createMockEditor();
    vi.clearAllMocks();
  });

  it('should accept an onChange prop without error', async () => {
    const onChange = vi.fn();
    expect(() => renderEditor({ onChange })).not.toThrow();
  });

  it('should call onChange with html and css when content changes', async () => {
    const onChange = vi.fn();
    await renderEditor({ onChange });

    // Simulate GrapesJS content change event
    mockEditor.emit('component:update');

    expect(onChange).toHaveBeenCalledWith('<div></div>', 'div {}');
  });

  it('should call onChange on style property update', async () => {
    const onChange = vi.fn();
    await renderEditor({ onChange });

    mockEditor.emit('style:property:update');

    expect(onChange).toHaveBeenCalledWith('<div></div>', 'div {}');
  });

  it('should not throw when onChange is not provided', async () => {
    await renderEditor({});

    // Emitting without onChange should not throw
    expect(() => mockEditor.emit('component:update')).not.toThrow();
  });

  it('should subscribe to component:update and style:property:update events', async () => {
    await renderEditor({ onChange: vi.fn() });

    const events = Object.keys(mockEditor._listeners);
    expect(events).toContain('component:update');
    expect(events).toContain('style:property:update');
  });
});

describe('GrapesJSEditor block registration', () => {
  beforeEach(() => {
    mockEditor = createMockEditor();
    vi.clearAllMocks();
  });

  it('registers 7 custom widget blocks and data-list block on init', async () => {
    await renderEditor({});
    expect(mockEditor._blocks).toHaveLength(8);
  });

  it('registers all required widget and data block IDs', async () => {
    await renderEditor({});
    expect(mockEditor._blocks).toContain('widget-text');
    expect(mockEditor._blocks).toContain('widget-heading');
    expect(mockEditor._blocks).toContain('widget-image');
    expect(mockEditor._blocks).toContain('widget-value');
    expect(mockEditor._blocks).toContain('widget-list');
    expect(mockEditor._blocks).toContain('widget-divider');
    expect(mockEditor._blocks).toContain('widget-icon');
    expect(mockEditor._blocks).toContain('data-list');
  });
});

describe('GrapesJSEditor style manager configuration', () => {
  beforeEach(() => {
    mockEditor = createMockEditor();
    vi.clearAllMocks();
  });

  it('registers style properties including color and font-family on init', async () => {
    await renderEditor({});
    const names = mockEditor._properties.map((p) => p.name);
    expect(names).toContain('color');
    expect(names).toContain('font-family');
  });
});

describe('GrapesJSEditor size toggle', () => {
  beforeEach(() => {
    mockEditor = createMockEditor();
    vi.clearAllMocks();
  });

  it('should render size toggle buttons for small, medium, and large', async () => {
    const { getByRole } = await renderEditor({});
    const group = getByRole('group');
    expect(group).toBeTruthy();

    const buttons = group.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('should default to medium size with aria-pressed', async () => {
    const { getByRole } = await renderEditor({});
    const group = getByRole('group');
    const buttons = group.querySelectorAll('button');

    // small, medium, large — medium (index 1) should be pressed
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('should update aria-pressed when a different size is clicked', async () => {
    const { getByRole } = await renderEditor({});
    const group = getByRole('group');
    const buttons = group.querySelectorAll('button');

    // Click "small" button
    await fireEvent.click(buttons[0]);

    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('should call Canvas.setDimensions when size changes', async () => {
    await renderEditor({});
    const group = document.querySelector('[role="group"]')!;
    const buttons = group.querySelectorAll('button');

    // Click "small"
    await fireEvent.click(buttons[0]);
    expect(mockEditor.Canvas.setDimensions).toHaveBeenCalledWith({
      width: 200,
      height: 150,
    });

    // Click "large"
    await fireEvent.click(buttons[2]);
    expect(mockEditor.Canvas.setDimensions).toHaveBeenCalledWith({
      width: 400,
      height: 300,
    });
  });

  it('should call onSizeChange callback with the new size key', async () => {
    const onSizeChange = vi.fn();
    const { getByRole } = await renderEditor({ onSizeChange });
    const group = getByRole('group');
    const buttons = group.querySelectorAll('button');

    await fireEvent.click(buttons[0]);
    expect(onSizeChange).toHaveBeenCalledWith('small');

    await fireEvent.click(buttons[2]);
    expect(onSizeChange).toHaveBeenCalledWith('large');
  });

  it('should not throw when onSizeChange is not provided', async () => {
    const { getByRole } = await renderEditor({});
    const group = getByRole('group');
    const buttons = group.querySelectorAll('button');

    expect(() => fireEvent.click(buttons[0])).not.toThrow();
  });
});
