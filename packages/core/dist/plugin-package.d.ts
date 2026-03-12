import type { PluginManifest } from '@lensing/types';
export interface ConnectorInput {
    type: string;
    url: string;
    method?: string;
    headers?: Record<string, string>;
    refreshInterval?: number;
}
export interface PackageInput {
    id: string;
    name: string;
    version: string;
    description?: string;
    category?: string;
    connector: ConnectorInput;
    html: string;
    css: string;
    thumbnail?: Buffer;
}
export interface PackageResult {
    buffer: Buffer;
    manifest: PluginManifest;
    sizeBytes: number;
}
export declare function packagePlugin(input: PackageInput): PackageResult;
//# sourceMappingURL=plugin-package.d.ts.map