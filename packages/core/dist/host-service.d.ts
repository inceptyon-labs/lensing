import type { BootedModule } from './module-boot';
import type { HostServiceOptions, DatabaseInstance, PluginLoader } from '@lensing/types';
import type { DataBusInstance } from '@lensing/types';
import type { RestServerInstance } from './rest-server';
import type { WsServerInstance } from './ws-server';
/** Public interface returned by createHostService factory */
export interface HostServiceInstance {
    /** Resolves when the host service has fully booted (all services ready) */
    ready: Promise<void>;
    /** Actual bound port (available after ready resolves) */
    readonly port: number;
    /** Stop all services and release resources */
    close(): Promise<void>;
    /** The database instance (available after ready) */
    readonly db: DatabaseInstance;
    /** The REST server instance (available after ready) */
    readonly rest: RestServerInstance;
    /** The WebSocket server instance (available after ready) */
    readonly ws: WsServerInstance;
    /** The plugin loader instance (available after ready) */
    readonly plugins: PluginLoader;
    /** Booted built-in modules (available after ready) */
    readonly modules: BootedModule[];
    /** The data bus instance (available after ready) */
    readonly dataBus: DataBusInstance;
}
export declare function createHostService(options?: HostServiceOptions): HostServiceInstance;
//# sourceMappingURL=host-service.d.ts.map