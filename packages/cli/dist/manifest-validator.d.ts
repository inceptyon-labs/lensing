import type { PluginManifest } from '@lensing/types';
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    manifest?: PluginManifest;
}
export declare function validateManifest(input: unknown): ValidationResult;
//# sourceMappingURL=manifest-validator.d.ts.map