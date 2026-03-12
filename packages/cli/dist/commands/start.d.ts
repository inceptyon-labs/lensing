import type { HostServiceInstance } from '@lensing/core';
export interface StartServerOptions {
    port?: number;
    pluginsDir?: string;
    dbPath?: string;
    logger?: {
        info(msg: string, data?: unknown): void;
        error(msg: string, err?: unknown): void;
    };
    authToken?: string;
    bindAddress?: string;
}
export interface StartServerResult {
    host: HostServiceInstance;
    port: number;
}
export declare function startServer(options?: StartServerOptions): Promise<StartServerResult>;
//# sourceMappingURL=start.d.ts.map