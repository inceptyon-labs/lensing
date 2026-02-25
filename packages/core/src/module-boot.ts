import type {
  DatabaseInstance,
  DataBusInstance,
  NotificationQueueInstance,
  ModuleId,
  HostServiceLogger,
} from '@lensing/types';
import { MODULE_SCHEMAS } from '@lensing/types';
import { readModuleConfig } from './module-settings';
import { createWeatherServer } from './weather-server';
import { createCryptoServer } from './crypto-server';
import { createNewsServer } from './news-server';
import { createSportsServer } from './sports-server';
import { createCalendarServer } from './caldav-client';
import { createHomeAssistantServer } from './home-assistant-server';
import { createAllergiesServer } from './allergies-server';
import { createPIRServer } from './pir-server';
import { createPhotoSlideshowServer } from './photo-slideshow-server';

/** Dependencies injected into module boot */
export interface BootDeps {
  dataBus: DataBusInstance;
  notifications: NotificationQueueInstance;
}

/** A successfully booted module */
export interface BootedModule {
  id: ModuleId;
  instance: { close(): void; refresh?(): Promise<void> };
  timer?: ReturnType<typeof setInterval>;
}

/** Polling intervals per module (ms). Modules without an entry are event-driven. */
const MODULE_REFRESH_MS: Partial<Record<ModuleId, number>> = {
  weather: 3_600_000, // 1 hour
  crypto: 300_000, // 5 min
  news: 600_000, // 10 min
  sports: 120_000, // 2 min
  calendar: 3_600_000, // 1 hour
  'home-assistant': 60_000, // 1 min
  allergies: 3_600_000, // 1 hour
  // pir: event-driven, no polling
  'photo-slideshow': 600_000, // 10 min
};

/**
 * Hot-restart a single module: close old instance, re-read config from DB,
 * boot new instance. Mutates the `modules` array by reference.
 * Returns the new BootedModule, or null if the module is disabled/unknown.
 */
export function rebootModule(
  id: ModuleId,
  modules: BootedModule[],
  db: DatabaseInstance,
  deps: BootDeps,
  log?: HostServiceLogger
): BootedModule | null {
  // Close and remove existing instance (if any)
  const existingIdx = modules.findIndex((m) => m.id === id);
  if (existingIdx !== -1) {
    const existing = modules[existingIdx]!;
    if (existing.timer !== undefined) {
      clearInterval(existing.timer);
    }
    try {
      existing.instance.close();
    } catch (err) {
      log?.error(`Module close failed: ${id}`, err);
    }
    modules.splice(existingIdx, 1);
  }

  // Find schema — return null for unknown modules
  const schema = MODULE_SCHEMAS.find((s) => s.id === id);
  if (!schema) return null;

  // Re-read config from DB
  const config = readModuleConfig(db, schema);
  if (!config.enabled) {
    log?.info(`Module disabled, removed: ${id}`);
    return null;
  }

  // Boot new instance (let errors propagate after old is already closed)
  const instance = bootModule(id, config.values, deps);
  if (!instance) return null;

  const booted: BootedModule = { id, instance };
  startPolling(booted, log);
  modules.push(booted);
  log?.info(`Module rebooted: ${id}`);
  return booted;
}

/** Fire initial refresh and set up periodic polling timer for a booted module. */
function startPolling(booted: BootedModule, log?: HostServiceLogger): void {
  const { id, instance } = booted;
  if (!instance.refresh) return;

  // Initial data fetch (fire-and-forget)
  instance.refresh().catch((err) => log?.error(`Initial refresh failed: ${id}`, err));

  // Periodic polling
  const interval = MODULE_REFRESH_MS[id];
  if (interval !== undefined) {
    booted.timer = setInterval(() => {
      instance.refresh!().catch((err) => log?.error(`Refresh failed: ${id}`, err));
    }, interval);
  }
}

/** Boot all enabled built-in modules based on DB settings */
export function bootEnabledModules(
  db: DatabaseInstance,
  deps: BootDeps,
  log?: HostServiceLogger
): BootedModule[] {
  const booted: BootedModule[] = [];

  for (const schema of MODULE_SCHEMAS) {
    const config = readModuleConfig(db, schema);
    if (!config.enabled) continue;

    try {
      const instance = bootModule(schema.id, config.values, deps);
      if (instance) {
        const booted_module: BootedModule = { id: schema.id, instance };
        startPolling(booted_module, log);
        booted.push(booted_module);
        log?.info(`Module booted: ${schema.id}`);
      }
    } catch (err) {
      log?.error(`Module boot failed: ${schema.id}`, err);
    }
  }

  log?.info(`Built-in modules booted`, { count: booted.length });
  return booted;
}

/** League ID → sport name for ESPN API */
const LEAGUE_SPORT_MAP: Record<string, string> = {
  nfl: 'football',
  nba: 'basketball',
  mlb: 'baseball',
  nhl: 'hockey',
  mls: 'soccer',
  ncaaf: 'football',
  ncaab: 'basketball',
};

/** Comma-separated string → string array */
function csvToArray(val: unknown): string[] {
  if (typeof val !== 'string' || val.trim() === '') return [];
  return val
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function bootModule(
  id: ModuleId,
  values: Record<string, string | number | boolean>,
  deps: BootDeps
): { close(): void } | null {
  const { dataBus, notifications } = deps;

  switch (id) {
    case 'weather':
      return createWeatherServer({
        provider: (values['provider'] as 'openweathermap' | 'open-meteo') ?? 'open-meteo',
        apiKey: values['apiKey'] ? String(values['apiKey']) : undefined,
        location: { lat: Number(values['lat']), lon: Number(values['lon']) },
        units: (values['units'] as 'imperial' | 'metric') ?? 'imperial',
        dataBus,
      });

    case 'crypto':
      return createCryptoServer({
        watchlist: csvToArray(values['watchlist']),
        dataBus,
        notifications,
      });

    case 'news':
      return createNewsServer({
        feedUrls: csvToArray(values['feedUrls']),
        maxItems: values['maxItems'] != null ? Number(values['maxItems']) : undefined,
        dataBus,
        notifications,
      });

    case 'sports': {
      const leagueIds = csvToArray(values['leagues']);
      return createSportsServer({
        leagues: leagueIds.map((l) => ({
          sport: LEAGUE_SPORT_MAP[l] ?? l,
          league: l,
        })),
        dataBus,
        notifications,
      });
    }

    case 'calendar': {
      const calOpts = {
        serverUrl: String(values['serverUrl'] ?? ''),
        username: String(values['username'] ?? ''),
        password: String(values['password'] ?? ''),
        calendarPath: String(values['calendarPath'] ?? ''),
        rangeDays: values['rangeDays'] != null ? Number(values['rangeDays']) : undefined,
        dataBus,
      };
      return createCalendarServer(calOpts);
    }

    case 'home-assistant':
      return createHomeAssistantServer({
        url: String(values['url'] ?? ''),
        token: String(values['token'] ?? ''),
        domains: values['domains'] ? csvToArray(values['domains']) : undefined,
        dataBus,
        notifications,
      });

    case 'allergies':
      return createAllergiesServer({
        apiKey: String(values['apiKey'] ?? ''),
        location: { lat: Number(values['lat']), lon: Number(values['lon']) },
        alertThreshold:
          values['alertThreshold'] != null ? Number(values['alertThreshold']) : undefined,
        dataBus,
        notifications,
      });

    case 'pir':
      return createPIRServer({
        idleTimeout_ms:
          values['idleTimeout_ms'] != null ? Number(values['idleTimeout_ms']) : undefined,
        dataBus,
      });

    case 'photo-slideshow':
      return createPhotoSlideshowServer({
        photoDir: String(values['photoDirectory'] ?? ''),
        dataBus,
      });

    default:
      return null;
  }
}
