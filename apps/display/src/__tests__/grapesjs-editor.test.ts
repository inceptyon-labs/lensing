import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';

/** Minimal GrapesJS mock editor */
function createMockEditor(html = '<div></div>', css = 'div {}') {
  const listeners: Record<string, Array<() => void>> = {};

  return {
    on: vi.fn((event: string, cb: () => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    }),
    getHtml: vi.fn(() => html),
    getCss: vi.fn(() => css),
    destroy: vi.fn(),
    /** Test helper: emit a registered event */
    emit(event: string) {
      for (const cb of listeners[event] ?? []) cb();
    },
    _listeners: listeners,
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
