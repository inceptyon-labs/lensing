import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import WidgetTemplatePicker from '../lib/WidgetTemplatePicker.svelte';
import { WIDGET_TEMPLATES } from '../lib/grapes-templates';

describe('WidgetTemplatePicker', () => {
  it('should render all template options', () => {
    render(WidgetTemplatePicker, { props: { onSelect: vi.fn() } });
    for (const t of WIDGET_TEMPLATES) {
      expect(screen.getByText(t.name)).toBeInTheDocument();
    }
  });

  it('should render a blank canvas option', () => {
    render(WidgetTemplatePicker, { props: { onSelect: vi.fn() } });
    expect(screen.getByText(/blank/i)).toBeInTheDocument();
  });

  it('should call onSelect with template when card clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(WidgetTemplatePicker, { props: { onSelect } });

    await user.click(screen.getByText(WIDGET_TEMPLATES[0].name));
    expect(onSelect).toHaveBeenCalledWith(WIDGET_TEMPLATES[0]);
  });

  it('should call onSelect with null for blank canvas', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(WidgetTemplatePicker, { props: { onSelect } });

    await user.click(screen.getByText(/blank/i));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('should show template descriptions', () => {
    render(WidgetTemplatePicker, { props: { onSelect: vi.fn() } });
    for (const t of WIDGET_TEMPLATES) {
      expect(screen.getByText(t.description)).toBeInTheDocument();
    }
  });

  it('should render picker container with proper class', () => {
    const { container } = render(WidgetTemplatePicker, { props: { onSelect: vi.fn() } });
    expect(container.querySelector('.template-picker')).toBeInTheDocument();
  });
});
