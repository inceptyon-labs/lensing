import type { PluginManifest } from '@lensing/types';
import { type PackageInput } from './plugin-package';
export interface BuilderSaveInput extends PackageInput {
}
export interface SaveOptions {
    overwrite?: boolean;
}
export interface SaveResult {
    pluginId: string;
    manifest: PluginManifest;
}
export declare function savePluginFromBuilder(input: BuilderSaveInput, pluginsDir: string, options?: SaveOptions): Promise<SaveResult>;
//# sourceMappingURL=plugin-save.d.ts.map