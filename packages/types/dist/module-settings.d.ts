import type { ConfigField } from './index';
/** Identifier for a built-in server module */
export type ModuleId = 'weather' | 'crypto' | 'news' | 'sports' | 'calendar' | 'home-assistant' | 'allergies' | 'pir' | 'photo-slideshow' | 'ai-news' | 'word-of-day' | 'finance';
/** All module IDs as a constant array */
export declare const MODULE_IDS: readonly ModuleId[];
/** Schema describing a built-in module's user-configurable settings */
export interface ModuleSettingsSchema {
    id: ModuleId;
    name: string;
    description: string;
    fields: ConfigField[];
    /** If true, module is system infrastructure (boots automatically, not a dashboard widget) */
    system?: boolean;
    /** User-facing setup instructions shown in the admin config modal */
    setupGuide?: string;
}
/** Settings schemas for all built-in modules */
export declare const MODULE_SCHEMAS: readonly ModuleSettingsSchema[];
/** IDs of system modules (infrastructure, not dashboard widgets) */
export declare const SYSTEM_MODULE_IDS: readonly ModuleId[];
/** Returns only the integration-category fields for a module schema */
export declare function getIntegrationFields(schema: ModuleSettingsSchema): ConfigField[];
/** Returns only the widget-category fields for a module schema */
export declare function getWidgetFields(schema: ModuleSettingsSchema): ConfigField[];
/** Returns true if the module has any integration fields (requires central service config) */
export declare function moduleNeedsIntegration(schema: ModuleSettingsSchema): boolean;
//# sourceMappingURL=module-settings.d.ts.map