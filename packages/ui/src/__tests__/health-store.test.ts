import { describe, it, expect, beforeEach } from 'vitest';
import { createHealthStore } from '../health-store';
import type { HealthStore } from '../health-store';
import type {
  PluginHealthReport,
  SystemHealthSnapshot,
  ConnectivityStatus,
  ResourceBudgetViolation,
} from '@lensing/types';

describe('HealthStore', () => {
  let store: HealthStore;

  beforeEach(() => {
    store = createHealthStore();
  });

  describe('updatePluginHealth', () => {
    it('should store plugin health report', () => {
      const report: PluginHealthReport = {
        pluginId: 'weather',
        status: 'active',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date(Date.now() + 60000).toISOString(),
        errorCount: 0,
        errors: [],
        refreshCount: 5,
        resourceUsage: { cpuMs: 100, memoryBytes: 1000000 },
      };

      store.updatePluginHealth('weather', report);
      const health = store.getPluginHealth('weather');
      expect(health?.pluginId).toBe('weather');
      expect(health?.status).toBe('active');
    });

    it('should notify on plugin health update', () => {
      const report: PluginHealthReport = {
        pluginId: 'calendar',
        status: 'active',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date(Date.now() + 60000).toISOString(),
        errorCount: 0,
        errors: [],
        refreshCount: 3,
        resourceUsage: { cpuMs: 50, memoryBytes: 500000 },
      };

      let notified = false;
      store.onChange((action) => {
        if (action === 'plugin_health_updated') {
          notified = true;
        }
      });

      store.updatePluginHealth('calendar', report);
      expect(notified).toBe(true);
    });

    it('should track multiple plugins', () => {
      const report1: PluginHealthReport = {
        pluginId: 'weather',
        status: 'active',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date(Date.now() + 60000).toISOString(),
        errorCount: 0,
        errors: [],
        refreshCount: 5,
        resourceUsage: { cpuMs: 100, memoryBytes: 1000000 },
      };

      const report2: PluginHealthReport = {
        pluginId: 'calendar',
        status: 'active',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date(Date.now() + 60000).toISOString(),
        errorCount: 0,
        errors: [],
        refreshCount: 3,
        resourceUsage: { cpuMs: 50, memoryBytes: 500000 },
      };

      store.updatePluginHealth('weather', report1);
      store.updatePluginHealth('calendar', report2);

      const allHealth = store.getAllPluginHealth();
      expect(allHealth).toHaveLength(2);
    });
  });

  describe('updateSystemHealth', () => {
    it('should store system health snapshot', () => {
      const snapshot: SystemHealthSnapshot = {
        cpuPercent: 45.2,
        memoryUsedBytes: 512000000,
        memoryTotalBytes: 2000000000,
        diskUsedBytes: 10000000000,
        diskTotalBytes: 100000000000,
        chromiumMemoryBytes: 250000000,
        timestamp: new Date().toISOString(),
      };

      store.updateSystemHealth(snapshot);
      const health = store.getSystemHealth();
      expect(health?.cpuPercent).toBe(45.2);
    });

    it('should notify on system health update', () => {
      const snapshot: SystemHealthSnapshot = {
        cpuPercent: 50,
        memoryUsedBytes: 500000000,
        memoryTotalBytes: 2000000000,
        diskUsedBytes: 10000000000,
        diskTotalBytes: 100000000000,
        chromiumMemoryBytes: 200000000,
        timestamp: new Date().toISOString(),
      };

      let notified = false;
      store.onChange((action) => {
        if (action === 'system_health_updated') {
          notified = true;
        }
      });

      store.updateSystemHealth(snapshot);
      expect(notified).toBe(true);
    });
  });

  describe('updateConnectivity', () => {
    it('should store connectivity status', () => {
      const status: ConnectivityStatus = {
        online: true,
        latencyMs: 25,
        lastCheckAt: new Date().toISOString(),
      };

      store.updateConnectivity(status);
      const connectivity = store.getConnectivity();
      expect(connectivity?.online).toBe(true);
      expect(connectivity?.latencyMs).toBe(25);
    });

    it('should notify on connectivity update', () => {
      const status: ConnectivityStatus = {
        online: false,
        latencyMs: 0,
        lastCheckAt: new Date().toISOString(),
      };

      let notified = false;
      store.onChange((action) => {
        if (action === 'connectivity_updated') {
          notified = true;
        }
      });

      store.updateConnectivity(status);
      expect(notified).toBe(true);
    });
  });

  describe('addViolation', () => {
    it('should record resource budget violation', () => {
      const violation: ResourceBudgetViolation = {
        pluginId: 'weather',
        violationType: 'cpu_burst',
        limit: 500,
        actual: 750,
        timestamp: new Date().toISOString(),
      };

      store.addViolation(violation);
      const violations = store.getViolations();
      expect(violations).toHaveLength(1);
      expect(violations[0].pluginId).toBe('weather');
    });

    it('should notify on violation added', () => {
      const violation: ResourceBudgetViolation = {
        pluginId: 'calendar',
        violationType: 'refresh_rate',
        limit: 60000,
        actual: 30000,
        timestamp: new Date().toISOString(),
      };

      let notified = false;
      store.onChange((action) => {
        if (action === 'violation_added') {
          notified = true;
        }
      });

      store.addViolation(violation);
      expect(notified).toBe(true);
    });

    it('should track multiple violations', () => {
      const v1: ResourceBudgetViolation = {
        pluginId: 'weather',
        violationType: 'cpu_burst',
        limit: 500,
        actual: 750,
        timestamp: new Date().toISOString(),
      };

      const v2: ResourceBudgetViolation = {
        pluginId: 'calendar',
        violationType: 'memory_peak',
        limit: 10000000,
        actual: 15000000,
        timestamp: new Date().toISOString(),
      };

      store.addViolation(v1);
      store.addViolation(v2);
      expect(store.getViolations()).toHaveLength(2);
    });
  });

  describe('clearViolations', () => {
    it('should clear all violations', () => {
      const violation: ResourceBudgetViolation = {
        pluginId: 'weather',
        violationType: 'cpu_burst',
        limit: 500,
        actual: 750,
        timestamp: new Date().toISOString(),
      };

      store.addViolation(violation);
      expect(store.getViolations()).toHaveLength(1);

      store.clearViolations();
      expect(store.getViolations()).toHaveLength(0);
    });

    it('should notify on violations cleared', () => {
      const violation: ResourceBudgetViolation = {
        pluginId: 'weather',
        violationType: 'cpu_burst',
        limit: 500,
        actual: 750,
        timestamp: new Date().toISOString(),
      };

      store.addViolation(violation);

      let notified = false;
      store.onChange((action) => {
        if (action === 'violations_cleared') {
          notified = true;
        }
      });

      store.clearViolations();
      expect(notified).toBe(true);
    });
  });

  describe('getPluginErrors', () => {
    it('should return error list for specific plugin', () => {
      const report: PluginHealthReport = {
        pluginId: 'weather',
        status: 'error',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date().toISOString(),
        errorCount: 2,
        errors: ['Network timeout', 'Parse failed'],
        refreshCount: 10,
        resourceUsage: { cpuMs: 100, memoryBytes: 1000000 },
      };

      store.updatePluginHealth('weather', report);
      const errors = store.getPluginErrors('weather');
      expect(errors).toHaveLength(2);
      expect(errors).toContain('Network timeout');
    });

    it('should return empty array if no plugin found', () => {
      const errors = store.getPluginErrors('nonexistent');
      expect(errors).toHaveLength(0);
    });
  });

  describe('getState', () => {
    it('should return complete health store state', () => {
      const pluginReport: PluginHealthReport = {
        pluginId: 'weather',
        status: 'active',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date().toISOString(),
        errorCount: 0,
        errors: [],
        refreshCount: 5,
        resourceUsage: { cpuMs: 100, memoryBytes: 1000000 },
      };

      const systemSnapshot: SystemHealthSnapshot = {
        cpuPercent: 30,
        memoryUsedBytes: 500000000,
        memoryTotalBytes: 2000000000,
        diskUsedBytes: 10000000000,
        diskTotalBytes: 100000000000,
        chromiumMemoryBytes: 200000000,
        timestamp: new Date().toISOString(),
      };

      const connectivity: ConnectivityStatus = {
        online: true,
        latencyMs: 15,
        lastCheckAt: new Date().toISOString(),
      };

      store.updatePluginHealth('weather', pluginReport);
      store.updateSystemHealth(systemSnapshot);
      store.updateConnectivity(connectivity);

      const state = store.getState();
      expect(state.plugins.size).toBe(1);
      expect(state.system.cpuPercent).toBe(30);
      expect(state.connectivity.online).toBe(true);
    });
  });

  describe('onChange callback', () => {
    it('should support multiple listeners', () => {
      let count = 0;
      store.onChange(() => count++);
      store.onChange(() => count++);

      const report: PluginHealthReport = {
        pluginId: 'weather',
        status: 'active',
        lastRefreshAt: new Date().toISOString(),
        nextRefreshAt: new Date().toISOString(),
        errorCount: 0,
        errors: [],
        refreshCount: 1,
        resourceUsage: { cpuMs: 50, memoryBytes: 500000 },
      };

      store.updatePluginHealth('weather', report);
      expect(count).toBe(2);
    });
  });
});
