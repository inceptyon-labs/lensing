import { describe, it, expect } from 'vitest';
import { createAllergiesStore } from '../allergies-store';
import type { AllergyData } from '@lensing/types';

// ── Fixtures ───────────────────────────────────────────────────────────────

function createAllergyData(index = 2): AllergyData {
  return {
    index: index as 0 | 1 | 2 | 3 | 4 | 5,
    allergens: [
      { name: 'Grass Pollen', level: index as 0 | 1 | 2 | 3 | 4 | 5, category: 'pollen' },
    ],
    lastUpdated: Date.now(),
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Allergies Store', () => {
  describe('Initial State', () => {
    it('should start with null data', () => {
      const store = createAllergiesStore();
      expect(store.getState().data).toBeNull();
    });

    it('should start not loading', () => {
      const store = createAllergiesStore();
      expect(store.getState().isLoading).toBe(false);
    });

    it('should start with no error', () => {
      const store = createAllergiesStore();
      expect(store.getState().error).toBeNull();
    });
  });

  describe('setData', () => {
    it('should update state with new allergy data', () => {
      const store = createAllergiesStore();
      const data = createAllergyData(2);

      store.setData(data);

      expect(store.getState().data?.index).toBe(2);
    });

    it('should clear error on setData', () => {
      const store = createAllergiesStore();
      store.setError('some error');

      store.setData(createAllergyData());

      expect(store.getState().error).toBeNull();
    });

    it('should clear isLoading on setData', () => {
      const store = createAllergiesStore();
      store.setLoading(true);

      store.setData(createAllergyData());

      expect(store.getState().isLoading).toBe(false);
    });

    it('should store a copy of allergens (defensive)', () => {
      const store = createAllergiesStore();
      const data = createAllergyData(3);
      store.setData(data);

      // Mutating original should not affect stored data
      data.allergens[0].name = 'mutated';

      expect(store.getState().data?.allergens[0].name).toBe('Grass Pollen');
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const store = createAllergiesStore();
      store.setLoading(true);
      expect(store.getState().isLoading).toBe(true);
    });

    it('should clear loading state', () => {
      const store = createAllergiesStore();
      store.setLoading(true);
      store.setLoading(false);
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const store = createAllergiesStore();
      store.setError('API unavailable');
      expect(store.getState().error).toBe('API unavailable');
    });

    it('should clear data on error', () => {
      const store = createAllergiesStore();
      store.setData(createAllergyData());
      store.setError('error');
      expect(store.getState().data).toBeNull();
    });
  });

  describe('getSeverityColor', () => {
    it('should return success color for level 0 (none)', () => {
      const store = createAllergiesStore();
      const color = store.getSeverityColor(0);
      expect(color).toContain('alert-success');
    });

    it('should return success color for level 1 (low)', () => {
      const store = createAllergiesStore();
      const color = store.getSeverityColor(1);
      expect(color).toContain('alert-success');
    });

    it('should return success color for level 2 (low-moderate)', () => {
      const store = createAllergiesStore();
      const color = store.getSeverityColor(2);
      expect(color).toContain('alert-success');
    });

    it('should return warning color for level 3 (moderate)', () => {
      const store = createAllergiesStore();
      const color = store.getSeverityColor(3);
      expect(color).toContain('alert-warning');
    });

    it('should return urgent color for level 4 (high)', () => {
      const store = createAllergiesStore();
      const color = store.getSeverityColor(4);
      expect(color).toContain('alert-urgent');
    });

    it('should return ember color for level 5 (very high)', () => {
      const store = createAllergiesStore();
      const color = store.getSeverityColor(5);
      expect(color).toContain('ember');
    });
  });

  describe('getSeverityLabel', () => {
    it('should return "None" for index 0', () => {
      const store = createAllergiesStore();
      expect(store.getSeverityLabel(0)).toBe('None');
    });

    it('should return "Low" for index 1', () => {
      const store = createAllergiesStore();
      expect(store.getSeverityLabel(1)).toBe('Low');
    });

    it('should return "Low" for index 2', () => {
      const store = createAllergiesStore();
      expect(store.getSeverityLabel(2)).toBe('Low');
    });

    it('should return "Moderate" for index 3', () => {
      const store = createAllergiesStore();
      expect(store.getSeverityLabel(3)).toBe('Moderate');
    });

    it('should return "High" for index 4', () => {
      const store = createAllergiesStore();
      expect(store.getSeverityLabel(4)).toBe('High');
    });

    it('should return "Very High" for index 5', () => {
      const store = createAllergiesStore();
      expect(store.getSeverityLabel(5)).toBe('Very High');
    });
  });

  describe('isStale', () => {
    it('should return false when no data', () => {
      const store = createAllergiesStore({ maxStale_ms: 1000 });
      expect(store.isStale()).toBe(false);
    });

    it('should return false when data is fresh', () => {
      const store = createAllergiesStore({ maxStale_ms: 3600000 });
      store.setData(createAllergyData());
      expect(store.isStale()).toBe(false);
    });

    it('should return true when data is older than maxStale_ms', () => {
      const store = createAllergiesStore({ maxStale_ms: 1000 });
      store.setData({
        index: 2,
        allergens: [],
        lastUpdated: Date.now() - 2000, // 2 seconds ago
      });
      expect(store.isStale()).toBe(true);
    });
  });

  describe('onChange', () => {
    it('should notify on setData', () => {
      const store = createAllergiesStore();
      const onChange = { called: false };
      store.onChange(() => {
        onChange.called = true;
      });

      store.setData(createAllergyData());

      expect(onChange.called).toBe(true);
    });

    it('should notify on setError', () => {
      const store = createAllergiesStore();
      const onChange = { called: false };
      store.onChange(() => {
        onChange.called = true;
      });

      store.setError('error');

      expect(onChange.called).toBe(true);
    });
  });
});
