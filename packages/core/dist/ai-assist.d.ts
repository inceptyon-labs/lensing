import type { AiAssistResponse, AiAssistPluginContext } from '@lensing/types';
import type { AiProvider } from './ai-assist-providers';
export interface AiAssistGenerateInput {
    docsText: string;
    pluginContext: AiAssistPluginContext;
}
export interface AiAssistOptions {
    provider: AiProvider;
    model?: string;
    maxDocsSize?: number;
}
export interface AiAssistInstance {
    generate(input: AiAssistGenerateInput): Promise<AiAssistResponse>;
}
/** Create an AI assist service that generates connector configs from API documentation */
export declare function createAiAssist(options: AiAssistOptions): AiAssistInstance;
//# sourceMappingURL=ai-assist.d.ts.map