import type { ConfigField } from './index';

/** Identifier for a built-in server module */
export type ModuleId =
  | 'weather'
  | 'crypto'
  | 'news'
  | 'sports'
  | 'calendar'
  | 'home-assistant'
  | 'allergies'
  | 'pir'
  | 'photo-slideshow';

/** All module IDs as a constant array */
export const MODULE_IDS: readonly ModuleId[] = [
  'weather',
  'crypto',
  'news',
  'sports',
  'calendar',
  'home-assistant',
  'allergies',
  'pir',
  'photo-slideshow',
] as const;

/** Schema describing a built-in module's user-configurable settings */
export interface ModuleSettingsSchema {
  id: ModuleId;
  name: string;
  description: string;
  fields: ConfigField[];
}

/** Settings schemas for all built-in modules */
export const MODULE_SCHEMAS: readonly ModuleSettingsSchema[] = [
  {
    id: 'weather',
    name: 'Weather',
    description: 'Current conditions and forecast via Open-Meteo (free) or OpenWeatherMap',
    fields: [
      {
        key: 'provider',
        type: 'select',
        label: 'Provider',
        default: 'open-meteo',
        category: 'integration',
        options: [
          { label: 'Open-Meteo (free, no key required)', value: 'open-meteo' },
          { label: 'OpenWeatherMap (requires API key)', value: 'openweathermap' },
        ],
      },
      {
        key: 'apiKey',
        type: 'password',
        label: 'API Key',
        description: 'Required for OpenWeatherMap only',
        category: 'integration',
      },
      {
        key: 'lat',
        type: 'number',
        label: 'Latitude',
        required: true,
        min: -90,
        max: 90,
        category: 'widget',
      },
      {
        key: 'lon',
        type: 'number',
        label: 'Longitude',
        required: true,
        min: -180,
        max: 180,
        category: 'widget',
      },
      {
        key: 'units',
        type: 'select',
        label: 'Units',
        default: 'imperial',
        category: 'widget',
        options: [
          { label: 'Imperial (°F)', value: 'imperial' },
          { label: 'Metric (°C)', value: 'metric' },
        ],
      },
    ],
  },
  {
    id: 'crypto',
    name: 'Crypto Prices',
    description: 'Cryptocurrency price tracker via CoinGecko',
    fields: [
      {
        key: 'watchlist',
        type: 'string',
        label: 'Watchlist',
        description: 'Comma-separated coin IDs (e.g. bitcoin,ethereum,solana)',
        default: 'bitcoin,ethereum',
        category: 'widget',
      },
    ],
  },
  {
    id: 'news',
    name: 'News Headlines',
    description: 'RSS feed aggregator for news headlines',
    fields: [
      {
        key: 'feedUrls',
        type: 'string',
        label: 'Feed URLs',
        description: 'Comma-separated RSS feed URLs',
        required: true,
        category: 'widget',
      },
      {
        key: 'maxItems',
        type: 'number',
        label: 'Max Items',
        default: 20,
        min: 1,
        max: 100,
        category: 'widget',
      },
    ],
  },
  {
    id: 'sports',
    name: 'Sports Scores',
    description: 'Live scores from ESPN',
    fields: [
      {
        key: 'leagues',
        type: 'string',
        label: 'Leagues',
        description: 'Comma-separated league IDs (e.g. nfl,nba,mlb)',
        default: 'nfl,nba',
        category: 'widget',
      },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'CalDAV calendar event sync',
    fields: [
      {
        key: 'serverUrl',
        type: 'string',
        label: 'Server URL',
        description: 'CalDAV server URL (e.g. https://caldav.icloud.com)',
        required: true,
        category: 'integration',
      },
      {
        key: 'username',
        type: 'string',
        label: 'Username',
        required: true,
        category: 'integration',
      },
      {
        key: 'password',
        type: 'password',
        label: 'Password',
        required: true,
        category: 'integration',
      },
      {
        key: 'calendarPath',
        type: 'string',
        label: 'Calendar Path',
        description: 'Collection path (e.g. /calendars/user@icloud.com/calendar/)',
        required: true,
        category: 'widget',
      },
      {
        key: 'rangeDays',
        type: 'number',
        label: 'Days Ahead',
        default: 7,
        min: 1,
        max: 90,
        category: 'widget',
      },
    ],
  },
  {
    id: 'home-assistant',
    name: 'Home Assistant',
    description: 'Smart home entity state via Home Assistant API',
    fields: [
      {
        key: 'url',
        type: 'string',
        label: 'URL',
        description: 'Home Assistant base URL (e.g. http://homeassistant.local:8123)',
        required: true,
        category: 'integration',
      },
      {
        key: 'token',
        type: 'password',
        label: 'Access Token',
        description: 'Long-lived access token',
        required: true,
        category: 'integration',
      },
      {
        key: 'domains',
        type: 'string',
        label: 'Domains',
        description: 'Comma-separated entity domains (e.g. light,switch,sensor)',
        default: 'light,switch,lock,climate,sensor,binary_sensor',
        category: 'widget',
      },
    ],
  },
  {
    id: 'allergies',
    name: 'Allergies / Pollen',
    description: 'Pollen and allergen index monitoring',
    fields: [
      {
        key: 'apiKey',
        type: 'password',
        label: 'API Key',
        required: true,
        category: 'integration',
      },
      {
        key: 'lat',
        type: 'number',
        label: 'Latitude',
        required: true,
        min: -90,
        max: 90,
        category: 'widget',
      },
      {
        key: 'lon',
        type: 'number',
        label: 'Longitude',
        required: true,
        min: -180,
        max: 180,
        category: 'widget',
      },
      {
        key: 'alertThreshold',
        type: 'number',
        label: 'Alert Threshold',
        description: 'Notify when index reaches this level (0-5)',
        default: 3,
        min: 0,
        max: 5,
        category: 'widget',
      },
    ],
  },
  {
    id: 'pir',
    name: 'PIR Sensor',
    description: 'Motion detection via GPIO PIR sensor',
    fields: [
      {
        key: 'gpioPin',
        type: 'number',
        label: 'GPIO Pin',
        description: 'BCM GPIO pin number the PIR sensor is connected to',
        default: 4,
        min: 0,
        max: 27,
        category: 'integration',
      },
      {
        key: 'idleTimeout_ms',
        type: 'number',
        label: 'Idle Timeout (ms)',
        description: 'Milliseconds without motion before idle state',
        default: 300000,
        min: 1000,
        category: 'widget',
      },
    ],
  },
  {
    id: 'photo-slideshow',
    name: 'Photo Slideshow',
    description: 'Ambient photo slideshow from a local directory',
    fields: [
      {
        key: 'photoDirectory',
        type: 'string',
        label: 'Photo Directory',
        description: 'Absolute path to the directory containing photos',
        required: true,
        category: 'integration',
      },
    ],
  },
];

/** Returns only the integration-category fields for a module schema */
export function getIntegrationFields(schema: ModuleSettingsSchema): ConfigField[] {
  return schema.fields.filter((f) => f.category === 'integration');
}

/** Returns only the widget-category fields for a module schema */
export function getWidgetFields(schema: ModuleSettingsSchema): ConfigField[] {
  return schema.fields.filter((f) => f.category === 'widget');
}

/** Returns true if the module has any integration fields (requires central service config) */
export function moduleNeedsIntegration(schema: ModuleSettingsSchema): boolean {
  return schema.fields.some((f) => f.category === 'integration');
}
