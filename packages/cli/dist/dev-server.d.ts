import type { PluginManifest } from '@lensing/types';
export interface DevServerOptions {
    pluginDir: string;
    fixturesDir: string;
    readFile: (path: string) => Promise<string>;
    readDir: () => Promise<string[]>;
    watch: (path: string, callback: (event: string, filename: string) => void) => {
        close: () => void;
    };
}
export interface DevServer {
    start(): Promise<void>;
    stop(): void;
    reload(): Promise<void>;
    isRunning(): boolean;
    getManifest(): PluginManifest | undefined;
    getFixtures(): Record<string, unknown>;
    onReload(callback: () => void): void;
}
export declare function createDevServer(options: DevServerOptions): DevServer;
//# sourceMappingURL=dev-server.d.ts.map