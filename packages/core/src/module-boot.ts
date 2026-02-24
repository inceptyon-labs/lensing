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

/** Dependencies injected into module boot */
export interface BootDeps {
  dataBus: DataBusInstance;
  notifications: NotificationQueueInstance;
}

/** A successfully booted module */
export interface BootedModule {
  id: ModuleId;
  instance: { close(): void };
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
        booted.push({ id: schema.id, instance });
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
        apiKey: String(values['apiKey'] ?? ''),
        location: { lat: Number(values['lat']), lon: Number(values['lon']) },
        units: (values['units'] as 'imperial' | 'metric') ?? 'imperial',
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

    default:
      return null;
  }
}
