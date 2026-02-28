import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BuilderWizard from '../lib/BuilderWizard.svelte';

const STEPS = [
  { label: 'Metadata', key: 'metadata' },
  { label: 'Data Source', key: 'data-source' },
  { label: 'Field Mapping', key: 'field-mapping' },
];

describe('BuilderWizard', () => {
  describe('step indicator', () => {
    it('should render step labels in the indicator', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      expect(screen.getByText('Metadata')).toBeInTheDocument();
      expect(screen.getByText('Data Source')).toBeInTheDocument();
      expect(screen.getByText('Field Mapping')).toBeInTheDocument();
    });

    it('should render step numbers', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should mark the first step as active initially', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      const indicators = screen.getAllByTestId('step-indicator');
      expect(indicators[0]).toHaveAttribute('data-active', 'true');
      expect(indicators[1]).toHaveAttribute('data-active', 'false');
      expect(indicators[2]).toHaveAttribute('data-active', 'false');
    });
  });

  describe('navigation buttons', () => {
    it('should show Next button on first step', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should hide Back button on first step', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });

    it('should show Cancel button', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should show Back button on second step', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false] },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should show Finish button on last step instead of Next', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, true, false] },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
    });
  });

  describe('step navigation', () => {
    it('should advance to next step when Next is clicked', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false] },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      const indicators = screen.getAllByTestId('step-indicator');
      expect(indicators[1]).toHaveAttribute('data-active', 'true');
    });

    it('should go back to previous step when Back is clicked', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false] },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await fireEvent.click(screen.getByRole('button', { name: /back/i }));

      const indicators = screen.getAllByTestId('step-indicator');
      expect(indicators[0]).toHaveAttribute('data-active', 'true');
    });

    it('should mark completed steps', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false] },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      const indicators = screen.getAllByTestId('step-indicator');
      expect(indicators[0]).toHaveAttribute('data-completed', 'true');
    });
  });

  describe('validation', () => {
    it('should disable Next when current step is not valid', () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [false, false, false] },
      });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeDisabled();
    });

    it('should enable Next when current step is valid', () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false] },
      });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).not.toBeDisabled();
    });

    it('should not advance when step is invalid', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [false, false, false] },
      });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      await fireEvent.click(nextBtn);

      const indicators = screen.getAllByTestId('step-indicator');
      expect(indicators[0]).toHaveAttribute('data-active', 'true');
    });
  });

  describe('step content', () => {
    it('should render slot content for the active step', () => {
      render(BuilderWizard, { props: { steps: STEPS } });

      expect(screen.getByTestId('wizard-content')).toBeInTheDocument();
    });

    it('should emit onStepChange when navigating', async () => {
      const onStepChange = vi.fn();
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false], onStepChange },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(onStepChange).toHaveBeenCalledWith(1);
    });

    it('should emit onStepChange with 0 when going back', async () => {
      const onStepChange = vi.fn();
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, false, false], onStepChange },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await fireEvent.click(screen.getByRole('button', { name: /back/i }));

      expect(onStepChange).toHaveBeenLastCalledWith(0);
    });
  });

  describe('cancel', () => {
    it('should emit onCancel when Cancel is clicked and not dirty', async () => {
      const onCancel = vi.fn();
      render(BuilderWizard, {
        props: { steps: STEPS, dirty: false, onCancel },
      });

      await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalled();
    });

    it('should show confirmation when Cancel is clicked and dirty', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, dirty: true },
      });

      await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });

    it('should emit onCancel when confirmation is accepted', async () => {
      const onCancel = vi.fn();
      render(BuilderWizard, {
        props: { steps: STEPS, dirty: true, onCancel },
      });

      await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      await fireEvent.click(screen.getByRole('button', { name: /discard|confirm|yes/i }));

      expect(onCancel).toHaveBeenCalled();
    });

    it('should dismiss confirmation when cancelled', async () => {
      const onCancel = vi.fn();
      render(BuilderWizard, {
        props: { steps: STEPS, dirty: true, onCancel },
      });

      await fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      await fireEvent.click(screen.getByRole('button', { name: /keep editing|go back|no/i }));

      expect(onCancel).not.toHaveBeenCalled();
      expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
    });
  });

  describe('finish', () => {
    it('should emit onFinish when Finish is clicked on last step', async () => {
      const onFinish = vi.fn();
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, true, true], onFinish },
      });

      // Navigate to last step
      await fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await fireEvent.click(screen.getByRole('button', { name: /finish/i }));

      expect(onFinish).toHaveBeenCalled();
    });

    it('should disable Finish when last step is not valid', async () => {
      render(BuilderWizard, {
        props: { steps: STEPS, stepValid: [true, true, false] },
      });

      await fireEvent.click(screen.getByRole('button', { name: /next/i }));
      await fireEvent.click(screen.getByRole('button', { name: /next/i }));

      const finishBtn = screen.getByRole('button', { name: /finish/i });
      expect(finishBtn).toBeDisabled();
    });
  });
});
