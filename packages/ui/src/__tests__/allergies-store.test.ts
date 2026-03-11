import { describe, it, expect } from 'vitest';
import { createAllergiesStore } from '../allergies-store';
import type { AllergyData } from '@lensing/types';

// ── Fixtures ───────────────────────────────────────────────────────────────

function createAllergyData(index = 5.5): AllergyData {
  return {
    index,
    level: 'Medium',
    color: '#ffeb3b',
    location: 'Beverly Hills, CA',
    periods: [
      { type: 'Yesterday', index: 4.2, triggers: [{ name: 'Alder', plantType: 'Tree' }] },
      {
        type: 'Today',
        index,
        triggers: [
          { name: 'Alder', plantType: 'Tree' },
          { name: 'Juniper', plantType: 'Tree' },
        ],
      },
      { type: 'Tomorrow', index: 6.1, triggers: [{ name: 'Ash', plantType: 'Tree' }] },
    ],
    triggers: [
      { name: 'Alder', plantType: 'Tree' },
      { name: 'Juniper', plantType: 'Tree' },
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
    it('should update state with new pollen data', () => {
      const store = createAllergiesStore();
      const data = createAllergyData(5.5);

      store.setData(data);

      expect(store.getState().data?.index).toBe(5.5);
      expect(store.getState().data?.level).toBe('Medium');
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

    it('should store a copy of triggers (defensive)', () => {
      const store = createAllergiesStore();
      const data = createAllergyData();
      store.setData(data);

      // Mutating original should not affect stored data
      data.triggers[0].name = 'mutated';

      expect(store.getState().data?.triggers[0].name).toBe('Alder');
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

    it('should clear isLoading on error', () => {
      const store = createAllergiesStore();
      store.setLoading(true);
      store.setError('error');
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('getPollenLevel', () => {
    it('should return "Low" for index 1.0', () => {
      const store = createAllergiesStore();
      expect(store.getPollenLevel(1.0)).toBe('Low');
    });

    it('should return "Low-Medium" for index 3.5', () => {
      const store = createAllergiesStore();
      expect(store.getPollenLevel(3.5)).toBe('Low-Medium');
    });

    it('should return "Medium" for index 6.0', () => {
      const store = createAllergiesStore();
      expect(store.getPollenLevel(6.0)).toBe('Medium');
    });

    it('should return "Medium-High" for index 8.5', () => {
      const store = createAllergiesStore();
      expect(store.getPollenLevel(8.5)).toBe('Medium-High');
    });

    it('should return "High" for index 10.5', () => {
      const store = createAllergiesStore();
      expect(store.getPollenLevel(10.5)).toBe('High');
    });
  });

  describe('getPollenColor', () => {
    it('should return green for Low', () => {
      const store = createAllergiesStore();
      expect(store.getPollenColor(1.0)).toBe('#4caf50');
    });

    it('should return red for High', () => {
      const store = createAllergiesStore();
      expect(store.getPollenColor(10.5)).toBe('#f44336');
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
      const data = createAllergyData();
      data.lastUpdated = Date.now() - 2000;
      store.setData(data);
      expect(store.isStale()).toBe(true);
    });
  });

  describe('onChange', () => {
    it('should notify on setData', () => {
      const store = createAllergiesStore();
      let called = false;
      store.onChange(() => {
        called = true;
      });

      store.setData(createAllergyData());

      expect(called).toBe(true);
    });

    it('should notify on setError', () => {
      const store = createAllergiesStore();
      let called = false;
      store.onChange(() => {
        called = true;
      });

      store.setError('error');

      expect(called).toBe(true);
    });
  });
});
