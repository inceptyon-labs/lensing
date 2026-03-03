import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import AdminAiAssist from '../lib/AdminAiAssist.svelte';
import type { AiAssistResponse } from '@lensing/types';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('AdminAiAssist', () => {
  const mockResponse: AiAssistResponse = {
    connector: {
      type: 'json_api',
      url: 'https://api.example.com/data',
      method: 'GET',
      headers: { 'X-API-Key': '{{WEATHER_API_KEY}}' },
      refreshInterval: 300,
    },
    html: '<div>{{temperature}}°F</div>',
    css: '.widget { padding: 16px; }',
    explanation: 'Fetches weather data from API',
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('rendering', () => {
    it('should render provider selector dropdown', () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      expect(screen.getByLabelText(/provider/i)).toBeInTheDocument();
    });

    it('should show provider options: anthropic, deepseek, gemini', () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const select = screen.getByLabelText(/provider/i) as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.value);

      expect(options).toContain('anthropic');
      expect(options).toContain('deepseek');
      expect(options).toContain('gemini');
    });

    it('should render docs input textarea', () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      expect(screen.getByLabelText(/documentation/i)).toBeInTheDocument();
    });

    it('should render generate button', () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    });

    it('should show loading spinner when generating', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(new Response(JSON.stringify(mockResponse))), 100);
          })
      );

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'Sample API docs' } });

      const generateBtn = screen.getByRole('button', { name: /generate/i });
      await fireEvent.click(generateBtn);

      // Spinner should appear while loading
      await waitFor(() => {
        expect(screen.getByText(/generating/i)).toBeInTheDocument();
      });
    });

    it('should show abort button during generation', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(new Response(JSON.stringify(mockResponse))), 500);
          })
      );

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'Sample API docs' } });

      const generateBtn = screen.getByRole('button', { name: /generate/i });
      await fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /abort|cancel/i })).toBeInTheDocument();
      });
    });
  });

  describe('provider selection', () => {
    it('should allow selecting different providers', async () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const select = screen.getByLabelText(/provider/i) as HTMLSelectElement;

      await fireEvent.change(select, { target: { value: 'deepseek' } });
      expect(select.value).toBe('deepseek');

      await fireEvent.change(select, { target: { value: 'gemini' } });
      expect(select.value).toBe('gemini');
    });

    it('should show message when no provider is configured', () => {
      render(AdminAiAssist, {
        props: { pluginContext: { name: 'Test' }, availableProviders: [] },
      });

      expect(screen.getByText(/not configured/i)).toBeInTheDocument();
    });
  });

  describe('documentation input', () => {
    it('should capture docs text from textarea', async () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      const docText = 'API endpoint: GET /weather\nReturns: {temp, humidity}';

      await fireEvent.input(docsInput, { target: { value: docText } });

      expect(docsInput.value).toBe(docText);
    });

    it('should disable generate button if docs are empty', async () => {
      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const generateBtn = screen.getByRole('button', { name: /generate/i });
      expect(generateBtn).toBeDisabled();

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'Docs' } });

      expect(generateBtn).not.toBeDisabled();
    });
  });

  describe('generate flow', () => {
    it('should send request to /api/admin/builder/ai-assist on generate', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test Plugin' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'GET /api/data' } });

      const generateBtn = screen.getByRole('button', { name: /generate/i });
      await fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/admin/builder/ai-assist', expect.anything());
      });

      const [_url, options] = mockFetch.mock.calls[0];
      const body = JSON.parse((options as RequestInit).body as string);

      expect(body).toMatchObject({
        provider: expect.any(String),
        docsTextOrUrl: 'GET /api/data',
        pluginContext: { name: 'Test Plugin' },
      });
    });

    it('should pass selected provider and model to request', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const providerSelect = screen.getByLabelText(/provider/i) as HTMLSelectElement;
      await fireEvent.change(providerSelect, { target: { value: 'deepseek' } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      const generateBtn = screen.getByRole('button', { name: /generate/i });
      await fireEvent.click(generateBtn);

      await waitFor(() => {
        const [_url, options] = mockFetch.mock.calls[0];
        const body = JSON.parse((options as RequestInit).body as string);
        expect(body.provider).toBe('deepseek');
      });
    });

    it('should display result after successful generation', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      const generateBtn = screen.getByRole('button', { name: /generate/i });
      await fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(screen.getByText(/https:\/\/api\.example\.com\/data/)).toBeInTheDocument();
        // HTML template content is in a textarea — findable via getByDisplayValue
        expect(screen.getByDisplayValue(/temperature/)).toBeInTheDocument();
      });
    });

    it('should show connector type in result preview', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/json_api/i)).toBeInTheDocument();
      });
    });

    it('should display HTML code block in result', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        const htmlArea = screen.getByDisplayValue(mockResponse.html);
        expect(htmlArea).toBeInTheDocument();
      });
    });

    it('should display CSS code block in result', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        const cssArea = screen.getByDisplayValue(mockResponse.css);
        expect(cssArea).toBeInTheDocument();
      });
    });
  });

  describe('apply button', () => {
    it('should render Apply to Builder button after successful generation', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      const onApply = vi.fn();
      render(AdminAiAssist, {
        props: { pluginContext: { name: 'Test' }, onApply },
      });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
      });
    });

    it('should call onApply callback with response when Apply button is clicked', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      const onApply = vi.fn();
      render(AdminAiAssist, {
        props: { pluginContext: { name: 'Test' }, onApply },
      });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        const applyBtn = screen.getByRole('button', { name: /apply/i });
        expect(applyBtn).toBeInTheDocument();
      });

      const applyBtn = screen.getByRole('button', { name: /apply/i });
      await fireEvent.click(applyBtn);

      expect(onApply).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should display error message when generation fails', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Invalid documentation' }), { status: 400 })
      );

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'Bad docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid documentation/i)).toBeInTheDocument();
      });
    });

    it('should display network error when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should display timeout error when generation takes too long', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/timeout/i)).toBeInTheDocument();
      });
    });

    it('should clear error when new generation is attempted', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Try again with successful response
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse), { status: 200 }));

      await fireEvent.input(docsInput, { target: { value: 'Better docs' } });
      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
        expect(screen.getByText(/https:\/\/api\.example\.com\/data/)).toBeInTheDocument();
      });
    });
  });

  describe('abort functionality', () => {
    it('should abort request when abort button is clicked', async () => {
      const abortSpy = vi.fn();
      const mockAbortController = {
        abort: abortSpy,
        signal: AbortSignal.abort(), // Use static factory instead of illegal constructor
      };

      vi.stubGlobal(
        'AbortController',
        vi.fn(() => mockAbortController)
      );

      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(new Response(JSON.stringify(mockResponse))), 1000);
          })
      );

      render(AdminAiAssist, { props: { pluginContext: { name: 'Test' } } });

      const docsInput = screen.getByLabelText(/documentation/i) as HTMLTextAreaElement;
      await fireEvent.input(docsInput, { target: { value: 'API docs' } });

      await fireEvent.click(screen.getByRole('button', { name: /generate/i }));

      await waitFor(() => {
        const abortBtn = screen.getByRole('button', { name: /abort|cancel/i });
        expect(abortBtn).toBeInTheDocument();
      });

      const abortBtn = screen.getByRole('button', { name: /abort|cancel/i });
      await fireEvent.click(abortBtn);

      await waitFor(() => {
        expect(abortSpy).toHaveBeenCalled();
      });
    });
  });
});
