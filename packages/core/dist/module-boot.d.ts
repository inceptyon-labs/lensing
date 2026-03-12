import type { DatabaseInstance, DataBusInstance, NotificationQueueInstance, GpioWatcherFactory, ModuleId, HostServiceLogger } from '@lensing/types';
import type { AiProvider } from './ai-assist-providers';
import type { AiProviderId } from '@lensing/types';
/** Dependencies injected into module boot */
export interface BootDeps {
    dataBus: DataBusInstance;
    notifications: NotificationQueueInstance;
    gpioFactory?: GpioWatcherFactory;
    /** AI providers loaded from env vars (shared with AI assist) */
    aiProviders?: Map<AiProviderId, AiProvider>;
}
/** A successfully booted module */
export interface BootedModule {
    id: ModuleId;
    instance: {
        close(): void;
        refresh?(): Promise<void>;
    };
    timer?: ReturnType<typeof setInterval>;
}
/**
 * Hot-restart a single module: close old instance, re-read config from DB,
 * boot new instance. Mutates the `modules` array by reference.
 * Returns the new BootedModule, or null if the module is disabled/unknown.
 */
export declare function rebootModule(id: ModuleId, modules: BootedModule[], db: DatabaseInstance, deps: BootDeps, log?: HostServiceLogger): BootedModule | null;
/** Boot all enabled built-in modules based on DB settings */
export declare function bootEnabledModules(db: DatabaseInstance, deps: BootDeps, log?: HostServiceLogger): BootedModule[];
/**
 * Reconcile running modules with the grid layout.
 * Boots modules that are in the layout but not running.
 * Stops modules that are running but not in the layout.
 * Ignores non-built-in module IDs (third-party plugins).
 * Returns updated BootedModule array.
 */
export declare function syncModulesWithLayout(layoutIds: string[], modules: BootedModule[], db: DatabaseInstance, deps: BootDeps, log?: HostServiceLogger): BootedModule[];
//# sourceMappingURL=module-boot.d.ts.map