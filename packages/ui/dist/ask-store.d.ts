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
export declare function createAskStore(options: AskStoreOptions): AskStore;
//# sourceMappingURL=ask-store.d.ts.map