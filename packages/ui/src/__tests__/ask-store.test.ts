import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAskStore, type AskStore } from '../ask-store';
import type { ConversationEntry } from '@lensing/types';

describe('AskStore', () => {
  let store: AskStore;

  beforeEach(() => {
    store = createAskStore({
      fetch: vi.fn(async (question: string) => ({
        id: 'conv-1',
        question,
        response: `Response to: ${question}`,
        timestamp: '2026-02-19T12:00:00Z',
        tool_calls_made: 0,
      })),
    });
  });

  describe('submitQuestion', () => {
    it('should set loading state while submitting', async () => {
      const onChange = vi.fn();
      store.onChange(onChange);

      const promise = store.submitQuestion('What is the weather?');
      expect(store.getStatus()).toBe('loading');

      await promise;
      expect(onChange).toHaveBeenCalled();
    });

    it('should add submitted question to history', async () => {
      await store.submitQuestion('Test question');
      const history = store.getHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].question).toBe('Test question');
    });

    it('should set response after agent processes', async () => {
      await store.submitQuestion('What time is it?');
      const response = store.getCurrentResponse();
      expect(response?.response).toContain('Response to:');
    });

    it('should set status to idle after successful submission', async () => {
      await store.submitQuestion('Test');
      expect(store.getStatus()).toBe('idle');
    });

    it('should handle fetch errors gracefully', async () => {
      const errorFetch = vi.fn(async () => {
        throw new Error('Network error');
      });
      store = createAskStore({ fetch: errorFetch });

      await expect(store.submitQuestion('Test')).rejects.toThrow('Network error');
      expect(store.getStatus()).toBe('error');
    });

    it('should set error message on failure', async () => {
      const errorFetch = vi.fn(async () => {
        throw new Error('Agent unavailable');
      });
      store = createAskStore({ fetch: errorFetch });

      try {
        await store.submitQuestion('Test');
      } catch {
        // Expected
      }
      expect(store.getLastError()).toContain('Agent unavailable');
    });

    it('should call onChange when state changes', async () => {
      const onChange = vi.fn();
      store.onChange(onChange);

      await store.submitQuestion('Test');
      expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(2); // At least loading + idle
    });
  });

  describe('getHistory', () => {
    it('should return empty array initially', () => {
      const history = store.getHistory();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });

    it('should preserve history across multiple questions', async () => {
      await store.submitQuestion('Question 1');
      await store.submitQuestion('Question 2');
      const history = store.getHistory();
      expect(history.length).toBe(2);
      expect(history[0].question).toBe('Question 1');
      expect(history[1].question).toBe('Question 2');
    });

    it('should return copy to prevent external mutation', async () => {
      await store.submitQuestion('Test');
      const history1 = store.getHistory();
      const history2 = store.getHistory();
      expect(history1).not.toBe(history2); // Different reference
      expect(history1).toEqual(history2); // Same content
    });
  });

  describe('getStatus', () => {
    it('should be idle initially', () => {
      expect(store.getStatus()).toBe('idle');
    });

    it('should be loading while submitting', async () => {
      let statusWhileLoading = '';
      const slowFetch = vi.fn<(question: string) => Promise<ConversationEntry>>(
        async () =>
          new Promise((resolve) => {
            statusWhileLoading = store.getStatus();
            resolve({
              id: 'conv-1',
              question: 'Test',
              response: 'Response',
              timestamp: '2026-02-19T12:00:00Z',
              tool_calls_made: 0,
            });
          })
      );
      store = createAskStore({ fetch: slowFetch });

      await store.submitQuestion('Test');
      expect(statusWhileLoading).toBe('loading');
    });

    it('should be error after failed submission', async () => {
      const errorFetch = vi.fn(async () => {
        throw new Error('Failed');
      });
      store = createAskStore({ fetch: errorFetch });

      try {
        await store.submitQuestion('Test');
      } catch {
        // Expected
      }
      expect(store.getStatus()).toBe('error');
    });
  });

  describe('getCurrentResponse', () => {
    it('should return null initially', () => {
      expect(store.getCurrentResponse()).toBeNull();
    });

    it('should return latest response after submission', async () => {
      await store.submitQuestion('Question 1');
      const response = store.getCurrentResponse();
      expect(response).not.toBeNull();
      expect(response?.question).toBe('Question 1');
    });

    it('should update to latest after multiple submissions', async () => {
      await store.submitQuestion('Question 1');
      await store.submitQuestion('Question 2');
      const response = store.getCurrentResponse();
      expect(response?.question).toBe('Question 2');
    });
  });

  describe('clearHistory', () => {
    it('should clear all entries', async () => {
      await store.submitQuestion('Test 1');
      await store.submitQuestion('Test 2');
      expect(store.getHistory().length).toBe(2);

      store.clearHistory();
      expect(store.getHistory().length).toBe(0);
    });

    it('should also clear current response', async () => {
      await store.submitQuestion('Test');
      expect(store.getCurrentResponse()).not.toBeNull();

      store.clearHistory();
      expect(store.getCurrentResponse()).toBeNull();
    });

    it('should call onChange when cleared', () => {
      const onChange = vi.fn();
      store.onChange(onChange);

      store.clearHistory();
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('onChange callback', () => {
    it('should support multiple listeners', async () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      store.onChange(listener1);
      store.onChange(listener2);

      await store.submitQuestion('Test');
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should notify on status changes', async () => {
      const onChange = vi.fn();
      store.onChange(onChange);

      await store.submitQuestion('Test');
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });

    it('should notify on clearHistory', () => {
      const onChange = vi.fn();
      store.onChange(onChange);

      store.clearHistory();
      expect(onChange).toHaveBeenCalled();
    });
  });
});
