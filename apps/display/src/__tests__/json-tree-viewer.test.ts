import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import JsonTreeViewer from '../lib/JsonTreeViewer.svelte';

describe('JsonTreeViewer', () => {
  const sampleData = {
    name: 'Test',
    count: 42,
    active: true,
    tags: ['alpha', 'beta'],
    nested: {
      deep: 'value',
      list: [{ id: 1, label: 'one' }],
    },
  };

  describe('rendering', () => {
    it('should render top-level object keys', () => {
      render(JsonTreeViewer, { props: { data: sampleData } });

      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('count')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('tags')).toBeInTheDocument();
      expect(screen.getByText('nested')).toBeInTheDocument();
    });

    it('should render primitive values inline', () => {
      render(JsonTreeViewer, { props: { data: sampleData } });

      expect(screen.getByText('"Test"')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument();
    });

    it('should render array items with indices', () => {
      render(JsonTreeViewer, { props: { data: { items: ['a', 'b'] } } });

      expect(screen.getByText('items')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render empty state when data is null', () => {
      render(JsonTreeViewer, { props: { data: null } });

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });
  });

  describe('field selection', () => {
    it('should call onSelect with JSONPath when a primitive field is clicked', async () => {
      const onSelect = vi.fn();
      render(JsonTreeViewer, { props: { data: sampleData, onSelect } });

      const nameValue = screen.getByText('"Test"');
      await fireEvent.click(nameValue);

      expect(onSelect).toHaveBeenCalledWith('$.name', 'Test');
    });

    it('should generate nested JSONPath for deep fields', async () => {
      const onSelect = vi.fn();
      render(JsonTreeViewer, { props: { data: sampleData, onSelect } });

      const deepValue = screen.getByText('"value"');
      await fireEvent.click(deepValue);

      expect(onSelect).toHaveBeenCalledWith('$.nested.deep', 'value');
    });

    it('should generate array-index JSONPath for array items', async () => {
      const onSelect = vi.fn();
      render(JsonTreeViewer, {
        props: { data: { items: ['first', 'second'] }, onSelect },
      });

      const secondValue = screen.getByText('"second"');
      await fireEvent.click(secondValue);

      expect(onSelect).toHaveBeenCalledWith('$.items[1]', 'second');
    });

    it('should highlight the selected path', async () => {
      render(JsonTreeViewer, {
        props: { data: sampleData, selectedPath: '$.name' },
      });

      const nameValue = screen.getByText('"Test"');
      expect(nameValue.closest('[data-selected]')).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('expand/collapse', () => {
    it('should show expand toggle for objects and arrays', () => {
      render(JsonTreeViewer, { props: { data: sampleData } });

      const toggles = screen.getAllByRole('button', { name: /toggle/i });
      expect(toggles.length).toBeGreaterThanOrEqual(2);
    });

    it('should hide nested content when collapsed', async () => {
      render(JsonTreeViewer, { props: { data: sampleData } });

      // nested key should be visible with its toggle
      const nestedToggle = screen
        .getByText('nested')
        .closest('[data-node]')
        ?.querySelector('button');
      expect(nestedToggle).toBeTruthy();

      await fireEvent.click(nestedToggle!);

      // deep child should be hidden
      expect(screen.queryByText('"value"')).not.toBeInTheDocument();
    });
  });
});
