import type { ConversationEntry } from '@lensing/types';

/** Options for creating an ask store */
export interface AskStoreOptions {
  /** Fetch function to submit questions to agent backend */
  fetch: (question: string) => Promise<ConversationEntry>;
}

/** Ask store interface for conversation management */
export interface AskStore {
  /** Submit a question to the agent */
  submitQuestion(question: string): Promise<void>;

  /** Get conversation history */
  getHistory(): ConversationEntry[];

  /** Get current loading/error/idle status */
  getStatus(): 'idle' | 'loading' | 'error';

  /** Get the most recent response */
  getCurrentResponse(): ConversationEntry | null;

  /** Get the last error message if status is 'error' */
  getLastError(): string | null;

  /** Clear all history and current response */
  clearHistory(): void;

  /** Register a callback for state changes */
  onChange(callback: () => void): void;
}

/** Create an ask store with the factory pattern */
export function createAskStore(options: AskStoreOptions): AskStore {
  let history: ConversationEntry[] = [];
  let currentResponse: ConversationEntry | null = null;
  let status: 'idle' | 'loading' | 'error' = 'idle';
  let lastError: string | null = null;
  const listeners: Set<() => void> = new Set();

  function notifyListeners(): void {
    listeners.forEach((fn) => fn());
  }

  return {
    async submitQuestion(question: string): Promise<void> {
      status = 'loading';
      lastError = null;
      notifyListeners();

      try {
        const entry = await options.fetch(question);
        history.push(entry);
        currentResponse = entry;
        status = 'idle';
      } catch (err) {
        status = 'error';
        lastError = err instanceof Error ? err.message : String(err);
        throw err;
      } finally {
        notifyListeners();
      }
    },

    getHistory(): ConversationEntry[] {
      return [...history];
    },

    getStatus(): 'idle' | 'loading' | 'error' {
      return status;
    },

    getCurrentResponse(): ConversationEntry | null {
      return currentResponse;
    },

    getLastError(): string | null {
      return lastError;
    },

    clearHistory(): void {
      history = [];
      currentResponse = null;
      status = 'idle';
      lastError = null;
      notifyListeners();
    },

    onChange(callback: () => void): void {
      listeners.add(callback);
    },
  };
}
