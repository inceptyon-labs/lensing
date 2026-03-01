import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';

/** Minimal GrapesJS mock editor */
function createMockEditor(html = '<div></div>', css = 'div {}') {
  const listeners: Record<string, Array<() => void>> = {};
  const registeredBlocks: string[] = [];

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
    /** Test helper: emit a registered event */
    emit(event: string) {
      for (const cb of listeners[event] ?? []) cb();
    },
    _listeners: listeners,
    _blocks: registeredBlocks,
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

  it('registers exactly 7 custom widget blocks on init', async () => {
    await renderEditor({});
    expect(mockEditor._blocks).toHaveLength(7);
  });

  it('registers all required widget block IDs', async () => {
    await renderEditor({});
    expect(mockEditor._blocks).toContain('widget-text');
    expect(mockEditor._blocks).toContain('widget-heading');
    expect(mockEditor._blocks).toContain('widget-image');
    expect(mockEditor._blocks).toContain('widget-value');
    expect(mockEditor._blocks).toContain('widget-list');
    expect(mockEditor._blocks).toContain('widget-divider');
    expect(mockEditor._blocks).toContain('widget-icon');
  });
});
