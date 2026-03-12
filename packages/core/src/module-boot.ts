import type {
  DatabaseInstance,
  DataBusInstance,
  NotificationQueueInstance,
  GpioWatcherFactory,
  ModuleId,
  HostServiceLogger,
} from '@lensing/types';
import {
  MODULE_SCHEMAS,
  MODULE_IDS,
  resolveCategoriesToFeeds,
  AI_NEWS_SCHEDULES,
  AI_NEWS_CATEGORIES,
} from '@lensing/types';
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
import { createAiNewsServer } from './ai-news-server';
import { createWordOfDayServer } from './word-of-day-server';
import { createFinanceServer } from './finance-server';
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
  'word-of-day': 3_600_000, // 1 hour (skips refresh if already have today's word)
  finance: 300_000, // 5 min
  // ai-news: schedule-driven, interval comes from config
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

  // Boot new instance (let errors propagate after old is already closed)
  const instance = bootModule(id, config.values, deps);
  if (!instance) return null;

  const booted: BootedModule = { id, instance };
  const overrideMs = id === 'ai-news' ? getAiNewsRefreshMs(config.values) : undefined;
  startPolling(booted, log, overrideMs);
  modules.push(booted);
  log?.info(`Module rebooted: ${id}`);
  return booted;
}

/** Fire initial refresh and set up periodic polling timer for a booted module. */
function startPolling(booted: BootedModule, log?: HostServiceLogger, overrideMs?: number): void {
  const { id, instance } = booted;
  if (!instance.refresh) return;

  // Initial data fetch (fire-and-forget)
  instance.refresh().catch((err) => log?.error(`Initial refresh failed: ${id}`, err));

  // Periodic polling
  const interval = overrideMs ?? MODULE_REFRESH_MS[id];
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
        const overrideMs = schema.id === 'ai-news' ? getAiNewsRefreshMs(config.values) : undefined;
        startPolling(booted_module, log, overrideMs);
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

/**
 * Reconcile running modules with the grid layout.
 * Boots modules that are in the layout but not running.
 * Stops modules that are running but not in the layout.
 * Ignores non-built-in module IDs (third-party plugins).
 * Returns updated BootedModule array.
 */
export function syncModulesWithLayout(
  layoutIds: string[],
  modules: BootedModule[],
  db: DatabaseInstance,
  deps: BootDeps,
  log?: HostServiceLogger
): BootedModule[] {
  const builtinIds = new Set(MODULE_IDS as readonly string[]);
  const desiredIds = new Set(layoutIds.filter((id) => builtinIds.has(id)));
  const runningIds = new Set<string>(modules.map((m) => m.id));

  // Stop modules that are running but not in layout
  const kept: BootedModule[] = [];
  for (const mod of modules) {
    if (desiredIds.has(mod.id)) {
      kept.push(mod);
    } else {
      if (mod.timer !== undefined) clearInterval(mod.timer);
      try {
        mod.instance.close();
      } catch (err) {
        log?.error(`Module close failed: ${mod.id}`, err);
      }
      log?.info(`Module stopped (removed from grid): ${mod.id}`);
    }
  }

  // Boot modules in layout that are not running
  for (const id of desiredIds) {
    if (runningIds.has(id)) continue;

    const schema = MODULE_SCHEMAS.find((s) => s.id === id);
    if (!schema) continue;

    try {
      const config = readModuleConfig(db, schema);
      const instance = bootModule(id as ModuleId, config.values, deps);
      if (instance) {
        const booted: BootedModule = { id: id as ModuleId, instance };
        const overrideMs = id === 'ai-news' ? getAiNewsRefreshMs(config.values) : undefined;
        startPolling(booted, log, overrideMs);
        kept.push(booted);
        log?.info(`Module booted (added to grid): ${id}`);
      }
    } catch (err) {
      log?.error(`Module boot failed: ${id}`, err);
    }
  }

  return kept;
}

/** League ID → ESPN API path segments { sport, slug } */
const LEAGUE_ESPN_MAP: Record<string, { sport: string; slug: string }> = {
  nfl: { sport: 'football', slug: 'nfl' },
  nba: { sport: 'basketball', slug: 'nba' },
  mlb: { sport: 'baseball', slug: 'mlb' },
  nhl: { sport: 'hockey', slug: 'nhl' },
  mls: { sport: 'soccer', slug: 'mls' },
  ncaaf: { sport: 'football', slug: 'college-football' },
  ncaab: { sport: 'basketball', slug: 'mens-college-basketball' },
  wcbb: { sport: 'basketball', slug: 'womens-college-basketball' },
};

/** Get ai-news refresh interval from config (defaults to 2x-daily / 12h) */
function getAiNewsRefreshMs(values: Record<string, string | number | boolean>): number {
  const schedule = String(values['refreshSchedule'] ?? '2x-daily');
  return AI_NEWS_SCHEDULES[schedule] ?? AI_NEWS_SCHEDULES['2x-daily']!;
}

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
): { close(): void; refresh?(): Promise<void> } | null {
  const { dataBus, notifications, gpioFactory } = deps;

  switch (id) {
    case 'weather':
      return createWeatherServer({
        provider: (values['provider'] as 'openweathermap' | 'open-meteo') ?? 'open-meteo',
        apiKey: values['apiKey'] ? String(values['apiKey']) : undefined,
        locationQuery: values['locationQuery'] ? String(values['locationQuery']) : undefined,
        location:
          values['lat'] != null && values['lon'] != null
            ? { lat: Number(values['lat']), lon: Number(values['lon']) }
            : undefined,
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
      const teamNames = csvToArray(values['teams']);
      return createSportsServer({
        leagues: leagueIds.map((l) => {
          const mapping = LEAGUE_ESPN_MAP[l];
          return {
            sport: mapping?.sport ?? l,
            league: mapping?.slug ?? l,
            label: l,
          };
        }),
        teams: teamNames.length > 0 ? teamNames : undefined,
        dataBus,
        notifications,
      });
    }

    case 'calendar': {
      const calPath = String(values['calendarPath'] ?? '').trim();
      const calOpts = {
        serverUrl: String(values['serverUrl'] ?? ''),
        username: String(values['username'] ?? ''),
        password: String(values['password'] ?? ''),
        ...(calPath ? { calendarPath: calPath } : {}),
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
        zipCode: String(values['zipCode'] ?? ''),
        alertThreshold:
          values['alertThreshold'] != null ? Number(values['alertThreshold']) : undefined,
        dataBus,
        notifications,
      });

    case 'pir':
      return createPIRServer({
        gpioPin: values['gpioPin'] != null ? Number(values['gpioPin']) : undefined,
        idleTimeout_ms:
          values['idleTimeout_ms'] != null ? Number(values['idleTimeout_ms']) : undefined,
        gpioFactory,
        dataBus,
      });

    case 'photo-slideshow':
      return createPhotoSlideshowServer({
        photoDir: String(values['photoDirectory'] ?? ''),
        dataBus,
      });

    case 'ai-news': {
      // Resolve category IDs → feed URLs + build feed→label mapping
      const categoryIds = csvToArray(values['categories']);
      const aiNewsFeedUrls = resolveCategoriesToFeeds(categoryIds);
      if (aiNewsFeedUrls.length === 0) return null; // No categories selected
      const idSet = new Set(categoryIds);
      const feedCategoryMap: Record<string, string> = {};
      for (const cat of AI_NEWS_CATEGORIES) {
        if (idSet.has(cat.id)) {
          for (const feed of cat.feeds) {
            feedCategoryMap[feed] = cat.label;
          }
        }
      }
      const aiProviderId = String(values['aiProvider'] ?? 'anthropic') as AiProviderId;
      const provider = deps.aiProviders?.get(aiProviderId);
      if (!provider) return null; // No API key configured for this provider
      const aiModelDefault: Record<string, string> = {
        anthropic: 'claude-sonnet-4-20250514',
        deepseek: 'deepseek-chat',
        gemini: 'gemini-2.0-flash',
      };
      const aiModel = String(values['aiModel'] || aiModelDefault[aiProviderId] || '');

      return createAiNewsServer({
        feedUrls: aiNewsFeedUrls,
        categories: feedCategoryMap,
        maxItems: values['maxItems'] != null ? Number(values['maxItems']) : undefined,
        dataBus,
        notifications,
        summarize: async (articles) => {
          const prompt = articles
            .map((a, i) => `${i + 1}. ${a.title}\n   ${a.summary}`)
            .join('\n\n');
          const response = await provider.generate(
            [
              {
                role: 'user',
                content:
                  `Summarize each of the following news headlines in 2-3 concise sentences. ` +
                  `Return ONLY a JSON array of strings, one summary per headline, in the same order.\n\n${prompt}`,
              },
            ],
            aiModel
          );
          try {
            const parsed = JSON.parse(
              response
                .trim()
                .replace(/^```json\s*/, '')
                .replace(/```\s*$/, '')
            );
            if (Array.isArray(parsed)) return parsed.map(String);
          } catch {
            // fallback: split by numbered lines
          }
          return articles.map((a) => a.summary);
        },
      });
    }

    case 'word-of-day': {
      return createWordOfDayServer({ dataBus });
    }

    case 'finance':
      return createFinanceServer({
        watchlist: csvToArray(values['watchlist']),
        dataBus,
      });

    default:
      return null;
  }
}
