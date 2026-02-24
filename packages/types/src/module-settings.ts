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
    description: 'Current conditions and forecast via OpenWeatherMap',
    fields: [
      { key: 'apiKey', type: 'password', label: 'API Key', required: true },
      { key: 'lat', type: 'number', label: 'Latitude', required: true, min: -90, max: 90 },
      { key: 'lon', type: 'number', label: 'Longitude', required: true, min: -180, max: 180 },
      {
        key: 'units',
        type: 'select',
        label: 'Units',
        default: 'imperial',
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
      },
      { key: 'maxItems', type: 'number', label: 'Max Items', default: 20, min: 1, max: 100 },
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
      },
      { key: 'username', type: 'string', label: 'Username', required: true },
      { key: 'password', type: 'password', label: 'Password', required: true },
      {
        key: 'calendarPath',
        type: 'string',
        label: 'Calendar Path',
        description: 'Collection path (e.g. /calendars/user@icloud.com/calendar/)',
        required: true,
      },
      { key: 'rangeDays', type: 'number', label: 'Days Ahead', default: 7, min: 1, max: 90 },
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
      },
      {
        key: 'token',
        type: 'password',
        label: 'Access Token',
        description: 'Long-lived access token',
        required: true,
      },
      {
        key: 'domains',
        type: 'string',
        label: 'Domains',
        description: 'Comma-separated entity domains (e.g. light,switch,sensor)',
        default: 'light,switch,lock,climate,sensor,binary_sensor',
      },
    ],
  },
  {
    id: 'allergies',
    name: 'Allergies / Pollen',
    description: 'Pollen and allergen index monitoring',
    fields: [
      { key: 'apiKey', type: 'password', label: 'API Key', required: true },
      { key: 'lat', type: 'number', label: 'Latitude', required: true, min: -90, max: 90 },
      { key: 'lon', type: 'number', label: 'Longitude', required: true, min: -180, max: 180 },
      {
        key: 'alertThreshold',
        type: 'number',
        label: 'Alert Threshold',
        description: 'Notify when index reaches this level (0-5)',
        default: 3,
        min: 0,
        max: 5,
      },
    ],
  },
  {
    id: 'pir',
    name: 'PIR Sensor',
    description: 'Motion detection via GPIO PIR sensor',
    fields: [
      {
        key: 'idleTimeout_ms',
        type: 'number',
        label: 'Idle Timeout (ms)',
        description: 'Milliseconds without motion before idle state',
        default: 300000,
        min: 1000,
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
      },
    ],
  },
];
