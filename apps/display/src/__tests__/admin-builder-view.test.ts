import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import AdminBuilderView from '../lib/AdminBuilderView.svelte';

// Mock fetch globally
const mockFetch = vi.fn() as Mock;
vi.stubGlobal('fetch', mockFetch);

/** Fill the metadata form with valid data and advance to the next step */
async function fillMetadataAndAdvance(
  opts: { name?: string; description?: string; category?: string } = {}
) {
  const { name = 'Test Plugin', description = 'A test plugin', category = 'utility' } = opts;
  await fireEvent.change(screen.getByLabelText('Plugin Name'), { target: { value: name } });
  await fireEvent.change(screen.getByLabelText('Description'), { target: { value: description } });
  await fireEvent.change(screen.getByLabelText('Category'), { target: { value: category } });
  await fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

/** Fill the code editor and advance to the next step */
async function fillCodeAndAdvance(htmlContent = '<div>Hello</div>', cssContent = '') {
  const htmlArea = screen.getByLabelText('HTML') as HTMLTextAreaElement;
  await fireEvent.input(htmlArea, { target: { value: htmlContent } });
  if (cssContent) {
    const cssArea = screen.getByLabelText('CSS') as HTMLTextAreaElement;
    await fireEvent.input(cssArea, { target: { value: cssContent } });
  }
  await fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

/** Pick a connector type and optionally fill URL, then advance */
async function fillDataSourceAndAdvance(
  type: 'json_api' | 'rss_feed' | 'static_data' = 'static_data',
  url = ''
) {
  const labels: Record<string, string> = {
    json_api: 'JSON API',
    rss_feed: 'RSS Feed',
    static_data: 'Static Data',
  };
  await fireEvent.click(screen.getByText(labels[type]));
  if (url) {
    const urlLabel = type === 'rss_feed' ? 'Feed URL' : 'URL';
    const urlInput = screen.getByLabelText(urlLabel) as HTMLInputElement;
    await fireEvent.change(urlInput, { target: { value: url } });
  }
  await fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

describe('AdminBuilderView', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('wizard structure', () => {
    it('should render wizard with 4 step indicators', () => {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

      const indicators = screen.getAllByTestId('step-indicator');
      expect(indicators).toHaveLength(4);
    });

    it('should label steps as Metadata, Template & Code, Data Source, Preview & Save', () => {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

      expect(screen.getByText('Metadata')).toBeInTheDocument();
      expect(screen.getByText('Template & Code')).toBeInTheDocument();
      expect(screen.getByText('Data Source')).toBeInTheDocument();
      expect(screen.getByText('Preview & Save')).toBeInTheDocument();
    });
  });

  describe('step 1: metadata', () => {
    it('should render metadata form fields on step 1', () => {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

      expect(screen.getByLabelText('Plugin Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
      expect(screen.getByLabelText('Plugin ID')).toBeInTheDocument();
    });

    it('should have Next disabled until metadata is valid', () => {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeDisabled();
    });

    it('should enable Next when metadata is filled', async () => {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

      await fireEvent.change(screen.getByLabelText('Plugin Name'), {
        target: { value: 'Test Plugin' },
      });
      await fireEvent.change(screen.getByLabelText('Description'), {
        target: { value: 'A test plugin' },
      });
      await fireEvent.change(screen.getByLabelText('Category'), {
        target: { value: 'utility' },
      });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).not.toBeDisabled();
    });

    it('should auto-generate plugin ID from name', async () => {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });

      await fireEvent.change(screen.getByLabelText('Plugin Name'), {
        target: { value: 'My Widget' },
      });

      expect(screen.getByDisplayValue('my-widget')).toBeInTheDocument();
    });
  });

  describe('step 2: template & code', () => {
    async function goToStep2() {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });
      await fillMetadataAndAdvance();
    }

    it('should show template picker on step 2', async () => {
      await goToStep2();

      expect(screen.getByText('Blank Canvas')).toBeInTheDocument();
      expect(screen.getByText('Single Value')).toBeInTheDocument();
    });

    it('should show HTML and CSS textareas on step 2', async () => {
      await goToStep2();

      expect(screen.getByLabelText('HTML')).toBeInTheDocument();
      expect(screen.getByLabelText('CSS')).toBeInTheDocument();
    });

    it('should pre-fill textareas when a template is selected', async () => {
      await goToStep2();

      await fireEvent.click(screen.getByText('Single Value'));

      const htmlArea = screen.getByLabelText('HTML') as HTMLTextAreaElement;
      const cssArea = screen.getByLabelText('CSS') as HTMLTextAreaElement;
      expect(htmlArea.value).toContain('sv-wrapper');
      expect(cssArea.value).toContain('sv-wrapper');
    });

    it('should clear textareas when Blank Canvas is selected', async () => {
      await goToStep2();

      await fireEvent.click(screen.getByText('Single Value'));
      await fireEvent.click(screen.getByText('Blank Canvas'));

      const htmlArea = screen.getByLabelText('HTML') as HTMLTextAreaElement;
      const cssArea = screen.getByLabelText('CSS') as HTMLTextAreaElement;
      expect(htmlArea.value).toBe('');
      expect(cssArea.value).toBe('');
    });

    it('should disable Next when HTML is empty', async () => {
      await goToStep2();

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeDisabled();
    });

    it('should enable Next when HTML has content', async () => {
      await goToStep2();

      const htmlArea = screen.getByLabelText('HTML') as HTMLTextAreaElement;
      await fireEvent.input(htmlArea, { target: { value: '<div>Hello</div>' } });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).not.toBeDisabled();
    });
  });

  describe('step 3: data source', () => {
    async function goToStep3() {
      render(AdminBuilderView, { props: { onCancel: vi.fn(), onSaved: vi.fn() } });
      await fillMetadataAndAdvance();
      await fillCodeAndAdvance();
    }

    it('should show connector type picker on step 3', async () => {
      await goToStep3();

      expect(screen.getByText('JSON API')).toBeInTheDocument();
      expect(screen.getByText('RSS Feed')).toBeInTheDocument();
      expect(screen.getByText('Static Data')).toBeInTheDocument();
    });

    it('should disable Next until a connector type is selected', async () => {
      await goToStep3();

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeDisabled();
    });

    it('should enable Next when Static Data is selected (no URL needed)', async () => {
      await goToStep3();

      await fireEvent.click(screen.getByText('Static Data'));

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).not.toBeDisabled();
    });

    it('should show URL field when JSON API is selected', async () => {
      await goToStep3();

      await fireEvent.click(screen.getByText('JSON API'));

      expect(screen.getByLabelText('URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Method')).toBeInTheDocument();
    });

    it('should require URL for JSON API before enabling Next', async () => {
      await goToStep3();

      await fireEvent.click(screen.getByText('JSON API'));

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeDisabled();

      await fireEvent.change(screen.getByLabelText('URL'), {
        target: { value: 'https://api.example.com/data' },
      });

      expect(nextBtn).not.toBeDisabled();
    });

    it('should show Feed URL field when RSS Feed is selected', async () => {
      await goToStep3();

      await fireEvent.click(screen.getByText('RSS Feed'));

      expect(screen.getByLabelText('Feed URL')).toBeInTheDocument();
    });

    it('should show refresh interval field when a type is selected', async () => {
      await goToStep3();

      await fireEvent.click(screen.getByText('JSON API'));

      expect(screen.getByLabelText('Refresh Interval (seconds)')).toBeInTheDocument();
    });
  });

  describe('step 4: preview & save', () => {
    async function goToStep4(
      props: { onCancel?: () => void; onSaved?: () => void } = {},
      opts: {
        name?: string;
        description?: string;
        category?: string;
        html?: string;
        css?: string;
      } = {}
    ) {
      const {
        name = 'Test Plugin',
        description = 'A test plugin',
        category = 'utility',
        html: htmlContent = '<div>Hello</div>',
        css: cssContent = '',
      } = opts;
      render(AdminBuilderView, {
        props: { onCancel: props.onCancel ?? vi.fn(), onSaved: props.onSaved ?? vi.fn() },
      });

      // Step 1: metadata
      await fillMetadataAndAdvance({ name, description, category });

      // Step 2: template & code
      await fillCodeAndAdvance(htmlContent, cssContent);

      // Step 3: data source (use static_data for simplicity)
      await fillDataSourceAndAdvance('static_data');
    }

    it('should show preview iframe on step 4', async () => {
      await goToStep4();

      expect(screen.getByTestId('preview-container')).toBeInTheDocument();
      expect(screen.getByTestId('preview-frame')).toBeInTheDocument();
    });

    it('should show Finish button on step 4', async () => {
      await goToStep4();

      expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
    });

    it('should POST to save endpoint when Finish is clicked', async () => {
      const onSaved = vi.fn();
      await goToStep4({ onSaved });

      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/admin/builder/save',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('"id":"test-plugin"'),
          })
        );
      });
    });

    it('should call onSaved on successful save', async () => {
      const onSaved = vi.fn();
      await goToStep4({ onSaved });

      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

      await waitFor(() => {
        expect(onSaved).toHaveBeenCalled();
      });
    });

    it('should show error message on save failure', async () => {
      await goToStep4();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });
      await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

      await waitFor(() => {
        expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
      });
    });

    it('should include correct payload with static_data connector', async () => {
      await goToStep4(
        {},
        {
          name: 'My Widget',
          description: 'Widget description',
          category: 'finance',
          html: '<p>content</p>',
          css: 'p { color: red; }',
        }
      );

      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

      await waitFor(() => {
        const call = mockFetch.mock.calls[0];
        const body = JSON.parse(call[1].body);
        expect(body).toEqual({
          id: 'my-widget',
          name: 'My Widget',
          version: '1.0.0',
          description: 'Widget description',
          category: 'finance',
          connector: { type: 'static_data', url: '', refreshInterval: 3600 },
          html: '<p>content</p>',
          css: 'p { color: red; }',
        });
      });
    });

    it('should include correct payload with json_api connector', async () => {
      render(AdminBuilderView, {
        props: { onCancel: vi.fn(), onSaved: vi.fn() },
      });

      // Step 1: metadata
      await fillMetadataAndAdvance({ name: 'API Widget' });

      // Step 2: code
      await fillCodeAndAdvance('<div>{{data}}</div>');

      // Step 3: data source - JSON API with URL
      await fireEvent.click(screen.getByText('JSON API'));
      await fireEvent.change(screen.getByLabelText('URL'), {
        target: { value: 'https://api.example.com/data' },
      });
      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      // Step 4: finish
      mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

      await waitFor(() => {
        const call = mockFetch.mock.calls[0];
        const body = JSON.parse(call[1].body);
        expect(body.connector).toEqual({
          type: 'json_api',
          url: 'https://api.example.com/data',
          method: 'GET',
          refreshInterval: 300,
        });
      });
    });
  });

  describe('cancel', () => {
    it('should call onCancel when Cancel is clicked on step 1 (no dirty state)', async () => {
      const onCancel = vi.fn();
      render(AdminBuilderView, { props: { onCancel, onSaved: vi.fn() } });

      await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalled();
    });
  });
});
