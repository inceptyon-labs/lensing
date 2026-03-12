import type { AiProviderId } from '@lensing/types';
/** Message role in conversation */
export type MessageRole = 'user' | 'assistant' | 'tool_result';
/** A single message in a conversation */
export interface Message {
    role: MessageRole;
    content: string;
}
/** Options for the generate call */
export interface GenerateOptions {
    fetchFn?: typeof fetch;
    timeoutMs?: number;
}
/** Model info returned by listModels */
export interface AiModelInfo {
    id: string;
    name: string;
}
/** LLM provider interface */
export interface AiProvider {
    provider: AiProviderId;
    generate(messages: Message[], model: string, options?: GenerateOptions): Promise<string>;
    listModels(options?: GenerateOptions): Promise<AiModelInfo[]>;
}
/** Configuration for creating a provider */
export interface AiProviderConfig {
    provider: AiProviderId;
    apiKey: string;
}
/**
 * Create an LLM provider instance for AI-assisted connector setup.
 * Supports Anthropic, DeepSeek, and Gemini.
 */
export declare function createAiProvider(config: AiProviderConfig): AiProvider;
//# sourceMappingURL=ai-assist-providers.d.ts.map