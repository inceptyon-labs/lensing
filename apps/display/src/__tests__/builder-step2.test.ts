import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BuilderStep2 from '../lib/BuilderStep2.svelte';

describe('BuilderStep2', () => {
  describe('connector type selection', () => {
    it('should show connector type picker initially', () => {
      render(BuilderStep2);

      expect(screen.getByText('JSON API')).toBeInTheDocument();
      expect(screen.getByText('RSS Feed')).toBeInTheDocument();
      expect(screen.getByText('Static Data')).toBeInTheDocument();
    });

    it('should show JSON API form when JSON API is selected', async () => {
      render(BuilderStep2);

      const jsonOption = screen.getByText('JSON API').closest('button')!;
      await fireEvent.click(jsonOption);

      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/method/i)).toBeInTheDocument();
    });

    it('should show RSS form when RSS Feed is selected', async () => {
      render(BuilderStep2);

      const rssOption = screen.getByText('RSS Feed').closest('button')!;
      await fireEvent.click(rssOption);

      expect(screen.getByLabelText(/feed url/i)).toBeInTheDocument();
    });

    it('should show static form when Static Data is selected', async () => {
      render(BuilderStep2);

      const staticOption = screen.getByText('Static Data').closest('button')!;
      await fireEvent.click(staticOption);

      expect(screen.getByText(/key/i)).toBeInTheDocument();
      expect(screen.getByText(/value/i)).toBeInTheDocument();
    });
  });

  describe('JSON API form fields', () => {
    async function renderJsonForm() {
      render(BuilderStep2);
      const jsonOption = screen.getByText('JSON API').closest('button')!;
      await fireEvent.click(jsonOption);
    }

    it('should have URL input', async () => {
      await renderJsonForm();
      expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
    });

    it('should have HTTP method dropdown with GET as default', async () => {
      await renderJsonForm();
      const select = screen.getByLabelText(/method/i) as HTMLSelectElement;
      expect(select.value).toBe('GET');
    });

    it('should have headers key-value editor', async () => {
      await renderJsonForm();
      expect(screen.getByText(/headers/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/header name/i)).toBeInTheDocument();
    });

    it('should have auth token field', async () => {
      await renderJsonForm();
      expect(screen.getByLabelText(/auth.*token/i)).toBeInTheDocument();
    });
  });

  describe('refresh interval', () => {
    it('should show refresh interval input when a type is selected', async () => {
      render(BuilderStep2);
      const jsonOption = screen.getByText('JSON API').closest('button')!;
      await fireEvent.click(jsonOption);

      expect(screen.getByLabelText(/refresh interval/i)).toBeInTheDocument();
    });

    it('should default to 5 minutes for JSON API', async () => {
      render(BuilderStep2);
      const jsonOption = screen.getByText('JSON API').closest('button')!;
      await fireEvent.click(jsonOption);

      const input = screen.getByLabelText(/refresh interval/i) as HTMLInputElement;
      expect(input.value).toBe('300');
    });

    it('should default to 30 minutes for RSS Feed', async () => {
      render(BuilderStep2);
      const rssOption = screen.getByText('RSS Feed').closest('button')!;
      await fireEvent.click(rssOption);

      const input = screen.getByLabelText(/refresh interval/i) as HTMLInputElement;
      expect(input.value).toBe('1800');
    });

    it('should default to 1 hour for Static Data', async () => {
      render(BuilderStep2);
      const staticOption = screen.getByText('Static Data').closest('button')!;
      await fireEvent.click(staticOption);

      const input = screen.getByLabelText(/refresh interval/i) as HTMLInputElement;
      expect(input.value).toBe('3600');
    });
  });

  describe('Test Connection', () => {
    it('should show Test Connection button when a type is selected', async () => {
      render(BuilderStep2);
      const jsonOption = screen.getByText('JSON API').closest('button')!;
      await fireEvent.click(jsonOption);

      expect(screen.getByRole('button', { name: /test connection/i })).toBeInTheDocument();
    });
  });
});
