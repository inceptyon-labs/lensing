import { describe, it, expect } from 'vitest';
import { createCryptoStore } from '../crypto-store';
import type { CryptoData } from '@lensing/types';

// ── Fixtures ───────────────────────────────────────────────────────────────

function createCryptoData(btcPrice = 50000, btcChange24h = 2.5): CryptoData {
  return {
    coins: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        price: btcPrice,
        change_1h: 0.3,
        change_24h: btcChange24h,
        change_7d: -1.2,
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        price: 3000,
        change_1h: -0.1,
        change_24h: 1.8,
        change_7d: 5.0,
      },
    ],
    lastUpdated: Date.now(),
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Crypto Store', () => {
  describe('Initial State', () => {
    it('should start with null data', () => {
      const store = createCryptoStore();
      expect(store.getState().data).toBeNull();
    });

    it('should start not loading', () => {
      const store = createCryptoStore();
      expect(store.getState().isLoading).toBe(false);
    });

    it('should start with no error', () => {
      const store = createCryptoStore();
      expect(store.getState().error).toBeNull();
    });
  });

  describe('setData', () => {
    it('should update state with new crypto data', () => {
      const store = createCryptoStore();
      store.setData(createCryptoData(50000));
      expect(store.getState().data?.coins[0].price).toBe(50000);
    });

    it('should clear error on setData', () => {
      const store = createCryptoStore();
      store.setError('some error');
      store.setData(createCryptoData());
      expect(store.getState().error).toBeNull();
    });

    it('should clear isLoading on setData', () => {
      const store = createCryptoStore();
      store.setLoading(true);
      store.setData(createCryptoData());
      expect(store.getState().isLoading).toBe(false);
    });

    it('should store a defensive copy of coins', () => {
      const store = createCryptoStore();
      const data = createCryptoData();
      store.setData(data);

      data.coins[0].price = 99999;

      expect(store.getState().data?.coins[0].price).toBe(50000);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const store = createCryptoStore();
      store.setLoading(true);
      expect(store.getState().isLoading).toBe(true);
    });

    it('should clear loading state', () => {
      const store = createCryptoStore();
      store.setLoading(true);
      store.setLoading(false);
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const store = createCryptoStore();
      store.setError('API error');
      expect(store.getState().error).toBe('API error');
    });

    it('should clear data on error', () => {
      const store = createCryptoStore();
      store.setData(createCryptoData());
      store.setError('error');
      expect(store.getState().data).toBeNull();
    });

    it('should clear isLoading on error', () => {
      const store = createCryptoStore();
      store.setLoading(true);
      store.setError('error');
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('getChangeColor', () => {
    it('should return success color for positive change', () => {
      const store = createCryptoStore();
      expect(store.getChangeColor(2.5)).toContain('alert-success');
    });

    it('should return urgent color for negative change', () => {
      const store = createCryptoStore();
      expect(store.getChangeColor(-2.5)).toContain('alert-urgent');
    });

    it('should return dim color for near-zero change (< 0.1%)', () => {
      const store = createCryptoStore();
      expect(store.getChangeColor(0.05)).toContain('dim-light');
    });

    it('should return dim color for exactly zero', () => {
      const store = createCryptoStore();
      expect(store.getChangeColor(0)).toContain('dim-light');
    });

    it('should return dim color for small negative change (< 0.1% abs)', () => {
      const store = createCryptoStore();
      expect(store.getChangeColor(-0.05)).toContain('dim-light');
    });
  });

  describe('getChangeLabel', () => {
    it('should prefix positive change with +', () => {
      const store = createCryptoStore();
      expect(store.getChangeLabel(2.5)).toBe('+2.50%');
    });

    it('should prefix negative change with -', () => {
      const store = createCryptoStore();
      expect(store.getChangeLabel(-1.23)).toBe('-1.23%');
    });

    it('should format zero change', () => {
      const store = createCryptoStore();
      expect(store.getChangeLabel(0)).toBe('+0.00%');
    });

    it('should show two decimal places', () => {
      const store = createCryptoStore();
      expect(store.getChangeLabel(1.5)).toBe('+1.50%');
    });
  });

  describe('formatPrice', () => {
    it('should format price with USD currency', () => {
      const store = createCryptoStore();
      const label = store.formatPrice(50000);
      expect(label).toContain('50');
    });

    it('should include comma separator for thousands', () => {
      const store = createCryptoStore();
      const label = store.formatPrice(50000);
      expect(label).toContain(',');
    });

    it('should handle small prices (fractions)', () => {
      const store = createCryptoStore();
      const label = store.formatPrice(0.00045);
      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
    });

    it('should handle zero price', () => {
      const store = createCryptoStore();
      expect(store.formatPrice(0)).toBeDefined();
    });
  });

  describe('isStale', () => {
    it('should return false when no data', () => {
      const store = createCryptoStore({ maxStale_ms: 1000 });
      expect(store.isStale()).toBe(false);
    });

    it('should return false when data is fresh', () => {
      const store = createCryptoStore({ maxStale_ms: 300000 });
      store.setData(createCryptoData());
      expect(store.isStale()).toBe(false);
    });

    it('should return true when data is older than maxStale_ms', () => {
      const store = createCryptoStore({ maxStale_ms: 1000 });
      store.setData({
        coins: [],
        lastUpdated: Date.now() - 2000,
      });
      expect(store.isStale()).toBe(true);
    });

    it('should return true for non-finite lastUpdated (corrupt data)', () => {
      const store = createCryptoStore({ maxStale_ms: 300000 });
      store.setData({
        coins: [],
        lastUpdated: NaN,
      });
      expect(store.isStale()).toBe(true);
    });
  });

  describe('onChange', () => {
    it('should notify on setData', () => {
      const store = createCryptoStore();
      let called = false;
      store.onChange(() => {
        called = true;
      });

      store.setData(createCryptoData());

      expect(called).toBe(true);
    });

    it('should notify on setError', () => {
      const store = createCryptoStore();
      let called = false;
      store.onChange(() => {
        called = true;
      });

      store.setError('error');

      expect(called).toBe(true);
    });

    it('should notify on setLoading', () => {
      const store = createCryptoStore();
      let called = false;
      store.onChange(() => {
        called = true;
      });

      store.setLoading(true);

      expect(called).toBe(true);
    });

    it('should return unsubscribe function', () => {
      const store = createCryptoStore();
      let callCount = 0;
      const unsubscribe = store.onChange(() => {
        callCount++;
      });

      unsubscribe();
      store.setData(createCryptoData());

      expect(callCount).toBe(0);
    });
  });

  describe('getCoinById', () => {
    it('should return a coin by id', () => {
      const store = createCryptoStore();
      store.setData(createCryptoData());

      const coin = store.getCoinById('bitcoin');
      expect(coin).not.toBeNull();
      expect(coin?.price).toBe(50000);
    });

    it('should return null when coin not found', () => {
      const store = createCryptoStore();
      store.setData(createCryptoData());

      expect(store.getCoinById('dogecoin')).toBeNull();
    });

    it('should return null when no data loaded', () => {
      const store = createCryptoStore();
      expect(store.getCoinById('bitcoin')).toBeNull();
    });

    it('should return a defensive copy', () => {
      const store = createCryptoStore();
      store.setData(createCryptoData());

      const coin = store.getCoinById('bitcoin')!;
      coin.price = 99999;

      expect(store.getCoinById('bitcoin')?.price).toBe(50000);
    });
  });
});
