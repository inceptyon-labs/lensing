import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BuilderStep3 from '../lib/BuilderStep3.svelte';

const sampleResponse = {
  title: 'Breaking News',
  summary: 'Something happened',
  imageUrl: 'https://example.com/img.jpg',
  published: '2026-02-28',
  source: { name: 'Reuters', url: 'https://reuters.com' },
};

describe('BuilderStep3', () => {
  describe('layout', () => {
    it('should render JSON tree viewer with sample data', () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      expect(screen.getByText('title')).toBeInTheDocument();
      expect(screen.getByText('summary')).toBeInTheDocument();
      expect(screen.getByText('imageUrl')).toBeInTheDocument();
    });

    it('should show available slot names', () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Image')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
    });

    it('should show empty state when no sample data provided', () => {
      render(BuilderStep3, { props: { sampleData: null } });

      expect(screen.getByText(/no sample data/i)).toBeInTheDocument();
    });
  });

  describe('mapping flow', () => {
    it('should allow selecting a slot to map', async () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      const titleSlot = screen.getByRole('button', { name: /map title/i });
      await fireEvent.click(titleSlot);

      expect(titleSlot).toHaveAttribute('aria-pressed', 'true');
    });

    it('should map a field to the active slot when clicked in the tree', async () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      // Select the "title" slot
      const titleSlot = screen.getByRole('button', { name: /map title/i });
      await fireEvent.click(titleSlot);

      // Click the "title" field value in the tree
      const titleValue = screen.getByText('"Breaking News"');
      await fireEvent.click(titleValue);

      // Should show the JSONPath in the mapping row
      expect(screen.getByText('$.title')).toBeInTheDocument();
    });

    it('should show mapped value preview in the summary', async () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      // Map title slot
      const titleSlot = screen.getByRole('button', { name: /map title/i });
      await fireEvent.click(titleSlot);
      await fireEvent.click(screen.getByText('"Breaking News"'));

      // Summary should show the preview
      const summarySection = screen.getByTestId('mapping-summary');
      expect(summarySection).toHaveTextContent('Breaking News');
    });

    it('should allow removing a mapping', async () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      // Map title slot
      const titleSlot = screen.getByRole('button', { name: /map title/i });
      await fireEvent.click(titleSlot);
      await fireEvent.click(screen.getByText('"Breaking News"'));

      // Remove the mapping
      const removeBtn = screen.getByRole('button', { name: /remove title/i });
      await fireEvent.click(removeBtn);

      // JSONPath should no longer be visible
      expect(screen.queryByText('$.title')).not.toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should disable advance when no mappings exist', () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      const advanceBtn = screen.getByRole('button', { name: /next|continue/i });
      expect(advanceBtn).toBeDisabled();
    });

    it('should enable advance after at least one mapping', async () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      // Map one field
      const titleSlot = screen.getByRole('button', { name: /map title/i });
      await fireEvent.click(titleSlot);
      await fireEvent.click(screen.getByText('"Breaking News"'));

      const advanceBtn = screen.getByRole('button', { name: /next|continue/i });
      expect(advanceBtn).not.toBeDisabled();
    });
  });

  describe('JSONPath display', () => {
    it('should display auto-generated JSONPath for each mapping', async () => {
      render(BuilderStep3, { props: { sampleData: sampleResponse } });

      // Map title slot
      const titleSlot = screen.getByRole('button', { name: /map title/i });
      await fireEvent.click(titleSlot);
      await fireEvent.click(screen.getByText('"Breaking News"'));

      // Map image slot
      const imageSlot = screen.getByRole('button', { name: /map image/i });
      await fireEvent.click(imageSlot);
      await fireEvent.click(screen.getByText('"https://example.com/img.jpg"'));

      expect(screen.getByText('$.title')).toBeInTheDocument();
      expect(screen.getByText('$.imageUrl')).toBeInTheDocument();
    });
  });
});
