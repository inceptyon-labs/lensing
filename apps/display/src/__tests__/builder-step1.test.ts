import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import BuilderStep1 from '../lib/BuilderStep1.svelte';

const ICON_OPTIONS = [
  { id: 'weather', label: 'Weather', icon: '☀️' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'stock', label: 'Stock', icon: '📈' },
];

describe('BuilderStep1 (Metadata Form)', () => {
  describe('layout', () => {
    it('should render all required form fields', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      expect(screen.getByText('Plugin Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Plugin ID')).toBeInTheDocument();
    });

    it('should render name input field', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();
      expect(nameInput.type).toBe('text');
      expect(nameInput.required).toBe(true);
    });

    it('should render description textarea', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const descriptionTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement;
      expect(descriptionTextarea).toBeInTheDocument();
      expect(descriptionTextarea.required).toBe(true);
    });

    it('should render category dropdown with predefined options', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement;
      expect(categorySelect).toBeInTheDocument();
      expect(categorySelect.required).toBe(true);

      const optionTexts = Array.from(categorySelect.options).map((opt) => opt.text);
      expect(optionTexts).toContain('Finance');
      expect(optionTexts).toContain('Weather');
      expect(optionTexts).toContain('News');
      expect(optionTexts).toContain('Sports');
      expect(optionTexts).toContain('Media');
      expect(optionTexts).toContain('Home');
      expect(optionTexts).toContain('Utility');
      expect(optionTexts).toContain('Other');
    });

    it('should render icon picker section', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      expect(screen.getByText('Icon')).toBeInTheDocument();
      // Icon options should be visible
      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('📅')).toBeInTheDocument();
    });

    it('should display plugin ID field (read-only)', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const idInput = screen.getByLabelText('Plugin ID') as HTMLInputElement;
      expect(idInput).toBeInTheDocument();
      expect(idInput.disabled).toBe(true);
    });

    it('should render Next button initially disabled', () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nextButton = screen.getByRole('button', { name: /next|continue/i });
      expect(nextButton).toBeDisabled();
    });
  });

  describe('name input and ID generation', () => {
    it('should auto-generate plugin ID from name', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      await fireEvent.change(nameInput, { target: { value: 'My Widget' } });

      const idInput = screen.getByDisplayValue('my-widget') as HTMLInputElement;
      expect(idInput).toBeInTheDocument();
    });

    it('should update ID in real-time as name changes', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;

      await fireEvent.change(nameInput, { target: { value: 'Hello' } });
      expect(screen.getByDisplayValue('hello')).toBeInTheDocument();

      await fireEvent.change(nameInput, { target: { value: 'Hello World' } });
      expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument();
    });

    it('should slugify special characters in ID', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      await fireEvent.change(nameInput, { target: { value: 'My-Widget: Pro!' } });

      const idInput = screen.getByDisplayValue('my-widget-pro') as HTMLInputElement;
      expect(idInput).toBeInTheDocument();
    });

    it('should handle uppercase letters in ID generation', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      await fireEvent.change(nameInput, { target: { value: 'MyNewWidget' } });

      const idInput = screen.getByDisplayValue('mynewwidget') as HTMLInputElement;
      expect(idInput).toBeInTheDocument();
    });

    it('should handle multiple spaces in name', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      await fireEvent.change(nameInput, { target: { value: 'My   Super   Widget' } });

      const idInput = screen.getByDisplayValue('my-super-widget') as HTMLInputElement;
      expect(idInput).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should require plugin name', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      expect(nameInput.required).toBe(true);

      const nextButton = screen.getByRole('button', { name: /next|continue/i });
      expect(nextButton).toBeDisabled();
    });

    it('should require description', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const descriptionTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement;
      expect(descriptionTextarea.required).toBe(true);
    });

    it('should require category selection', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement;
      expect(categorySelect.required).toBe(true);
    });

    it('should disable Next button when name is empty', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      const catSelect = screen.getByLabelText('Category') as HTMLSelectElement;
      const nextButton = screen.getByRole('button', { name: /next|continue/i });

      await fireEvent.change(descInput, { target: { value: 'Test desc' } });
      await fireEvent.change(catSelect, { target: { value: 'finance' } });

      expect(nextButton).toBeDisabled();
      expect(nameInput.value).toBe('');
    });

    it('should disable Next button when description is empty', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      const catSelect = screen.getByLabelText('Category') as HTMLSelectElement;
      const nextButton = screen.getByRole('button', { name: /next|continue/i });

      await fireEvent.change(nameInput, { target: { value: 'Test' } });
      await fireEvent.change(catSelect, { target: { value: 'finance' } });

      expect(nextButton).toBeDisabled();
    });

    it('should disable Next button when category is not selected', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      const nextButton = screen.getByRole('button', { name: /next|continue/i });

      await fireEvent.change(nameInput, { target: { value: 'Test' } });
      await fireEvent.change(descInput, { target: { value: 'Test desc' } });

      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when all required fields are filled', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      const catSelect = screen.getByLabelText('Category') as HTMLSelectElement;
      const nextButton = screen.getByRole('button', { name: /next|continue/i });

      await fireEvent.change(nameInput, { target: { value: 'My Plugin' } });
      await fireEvent.change(descInput, { target: { value: 'A great plugin' } });
      await fireEvent.change(catSelect, { target: { value: 'finance' } });

      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('icon selection', () => {
    it('should allow selecting an icon', async () => {
      const onSelect = vi.fn();
      render(BuilderStep1, { props: { icons: ICON_OPTIONS, onSelect } });

      const weatherIcon = screen.getByRole('button', { name: /weather|☀️/i });
      await fireEvent.click(weatherIcon);

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'weather',
          name: '',
          description: '',
          category: '',
        }),
      );
    });

    it('should highlight the selected icon', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const weatherIcon = screen.getByRole('button', { name: /weather|☀️/i });
      await fireEvent.click(weatherIcon);

      expect(weatherIcon).toHaveAttribute('aria-pressed', 'true');
    });

    it('should deselect previously selected icon when new one is clicked', async () => {
      render(BuilderStep1, { props: { icons: ICON_OPTIONS } });

      const weatherIcon = screen.getByRole('button', { name: /weather|☀️/i });
      const newsIcon = screen.getByRole('button', { name: /news|📰/i });

      await fireEvent.click(weatherIcon);
      expect(weatherIcon).toHaveAttribute('aria-pressed', 'true');

      await fireEvent.click(newsIcon);
      expect(weatherIcon).toHaveAttribute('aria-pressed', 'false');
      expect(newsIcon).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('form submission', () => {
    it('should emit onNext with metadata when Next button is clicked', async () => {
      const onNext = vi.fn();
      render(BuilderStep1, { props: { icons: ICON_OPTIONS, onNext } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      const catSelect = screen.getByLabelText('Category') as HTMLSelectElement;
      const nextButton = screen.getByRole('button', { name: /next|continue/i });

      await fireEvent.change(nameInput, { target: { value: 'My Plugin' } });
      await fireEvent.change(descInput, { target: { value: 'A great plugin' } });
      await fireEvent.change(catSelect, { target: { value: 'finance' } });
      await fireEvent.click(nextButton);

      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Plugin',
          description: 'A great plugin',
          category: 'finance',
          id: 'my-plugin',
        }),
      );
    });

    it('should include selected icon in onNext callback', async () => {
      const onNext = vi.fn();
      render(BuilderStep1, { props: { icons: ICON_OPTIONS, onNext } });

      const nameInput = screen.getByLabelText('Plugin Name') as HTMLInputElement;
      const descInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      const catSelect = screen.getByLabelText('Category') as HTMLSelectElement;
      const weatherIcon = screen.getByRole('button', { name: /weather|☀️/i });
      const nextButton = screen.getByRole('button', { name: /next|continue/i });

      await fireEvent.change(nameInput, { target: { value: 'My Plugin' } });
      await fireEvent.change(descInput, { target: { value: 'A great plugin' } });
      await fireEvent.change(catSelect, { target: { value: 'finance' } });
      await fireEvent.click(weatherIcon);
      await fireEvent.click(nextButton);

      expect(onNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Plugin',
          icon: 'weather',
        }),
      );
    });
  });
});
