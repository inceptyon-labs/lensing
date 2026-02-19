import type {
  PluginHealthReport,
  SystemHealthSnapshot,
  ConnectivityStatus,
  ResourceBudgetViolation,
  HealthStoreState,
} from '@lensing/types';

/** Options for creating a health store */
export interface HealthStoreOptions {
  onChange?: (action: string) => void;
}

/** Health store interface for aggregating plugin and system health */
export interface HealthStore {
  /** Update health report for a specific plugin */
  updatePluginHealth(pluginId: string, report: PluginHealthReport): void;

  /** Get health report for a specific plugin */
  getPluginHealth(pluginId: string): PluginHealthReport | undefined;

  /** Get health reports for all plugins */
  getAllPluginHealth(): PluginHealthReport[];

  /** Update system health snapshot */
  updateSystemHealth(snapshot: SystemHealthSnapshot): void;

  /** Get latest system health snapshot */
  getSystemHealth(): SystemHealthSnapshot | undefined;

  /** Update connectivity status */
  updateConnectivity(status: ConnectivityStatus): void;

  /** Get current connectivity status */
  getConnectivity(): ConnectivityStatus | undefined;

  /** Record a resource budget violation */
  addViolation(violation: ResourceBudgetViolation): void;

  /** Get all recorded violations */
  getViolations(): ResourceBudgetViolation[];

  /** Clear all recorded violations */
  clearViolations(): void;

  /** Get error list for a specific plugin */
  getPluginErrors(pluginId: string): string[];

  /** Get complete health store state */
  getState(): HealthStoreState;

  /** Register a callback for state changes. Returns a function to unsubscribe. */
  onChange(callback: (action: string) => void): () => void;
}

/** Create a health store with the factory pattern */
export function createHealthStore(options: HealthStoreOptions = {}): HealthStore {
  const plugins = new Map<string, PluginHealthReport>();
  let system: SystemHealthSnapshot | undefined;
  let connectivity: ConnectivityStatus | undefined;
  let violations: ResourceBudgetViolation[] = [];
  const listeners: Set<(action: string) => void> = new Set();

  if (options.onChange) {
    listeners.add(options.onChange);
  }

  function notify(action: string): void {
    listeners.forEach((fn) => {
      try {
        fn(action);
      } catch (error) {
        // Isolate listener failures to prevent cascading
        console.error(`Health store listener failed for action "${action}":`, error);
      }
    });
  }

  return {
    updatePluginHealth(pluginId: string, report: PluginHealthReport): void {
      // Defensive copy to prevent external mutation
      plugins.set(pluginId, {
        ...report,
        errors: [...report.errors],
        resourceUsage: { ...report.resourceUsage },
      });
      notify('plugin_health_updated');
    },

    getPluginHealth(pluginId: string): PluginHealthReport | undefined {
      const report = plugins.get(pluginId);
      if (!report) return undefined;
      // Defensive copy on read to prevent external mutation
      return {
        ...report,
        errors: [...report.errors],
        resourceUsage: { ...report.resourceUsage },
      };
    },

    getAllPluginHealth(): PluginHealthReport[] {
      return Array.from(plugins.values()).map((report) => ({
        ...report,
        errors: [...report.errors],
        resourceUsage: { ...report.resourceUsage },
      }));
    },

    updateSystemHealth(snapshot: SystemHealthSnapshot): void {
      system = snapshot;
      notify('system_health_updated');
    },

    getSystemHealth(): SystemHealthSnapshot | undefined {
      return system;
    },

    updateConnectivity(status: ConnectivityStatus): void {
      connectivity = status;
      notify('connectivity_updated');
    },

    getConnectivity(): ConnectivityStatus | undefined {
      return connectivity;
    },

    addViolation(violation: ResourceBudgetViolation): void {
      violations.push(violation);
      notify('violation_added');
    },

    getViolations(): ResourceBudgetViolation[] {
      return [...violations];
    },

    clearViolations(): void {
      violations = [];
      notify('violations_cleared');
    },

    getPluginErrors(pluginId: string): string[] {
      return plugins.get(pluginId)?.errors ?? [];
    },

    getState(): HealthStoreState {
      return {
        plugins: new Map(plugins),
        system: system ?? {
          cpuPercent: 0,
          memoryUsedBytes: 0,
          memoryTotalBytes: 0,
          diskUsedBytes: 0,
          diskTotalBytes: 0,
          chromiumMemoryBytes: 0,
          timestamp: new Date().toISOString(),
        },
        connectivity: connectivity ?? {
          online: false,
          latencyMs: 0,
          lastCheckAt: new Date().toISOString(),
        },
        violations: [...violations],
      };
    },

    onChange(callback: (action: string) => void): () => void {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
