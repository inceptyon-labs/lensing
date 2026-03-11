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
  | 'photo-slideshow'
  | 'ai-news';

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
  'ai-news',
] as const;

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
export const MODULE_SCHEMAS: readonly ModuleSettingsSchema[] = [
  {
    id: 'weather',
    name: 'Weather',
    description: 'Current conditions and forecast via Open-Meteo (free) or OpenWeatherMap',
    setupGuide:
      'Open-Meteo is free and requires no API key.\n\n' +
      'Enter a city name or zip code in the Location field — coordinates will be ' +
      'looked up automatically. Or set Latitude/Longitude directly for precision.\n\n' +
      'For OpenWeatherMap, sign up at openweathermap.org/api and get a free API key ' +
      '(the "Current Weather" plan is free for up to 1,000 calls/day).',
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
        key: 'locationQuery',
        type: 'string',
        label: 'Location',
        description: 'City name or zip code (e.g. "New York" or "10001")',
        category: 'widget',
      },
      {
        key: 'lat',
        type: 'number',
        label: 'Latitude',
        description: 'Optional if Location is set',
        min: -90,
        max: 90,
        category: 'widget',
      },
      {
        key: 'lon',
        type: 'number',
        label: 'Longitude',
        description: 'Optional if Location is set',
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
    setupGuide:
      'Uses the free CoinGecko API — no API key needed.\n\n' +
      'Enter coin IDs separated by commas. Find IDs at coingecko.com ' +
      '(the ID is in the URL, e.g. coingecko.com/en/coins/bitcoin → "bitcoin").\n\n' +
      'Common IDs: bitcoin, ethereum, solana, cardano, dogecoin, polkadot.',
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
    setupGuide:
      'Add RSS feed URLs separated by commas. No API key needed — this reads public RSS feeds directly.\n\n' +
      'Most news sites offer RSS feeds. Common ones:\n' +
      '• AP News: rss.app/feeds/v1.1/tPuMpEjSnHjHCFCd.xml\n' +
      '• Reuters: feeds.reuters.com/reuters/topNews\n' +
      '• BBC: feeds.bbci.co.uk/news/rss.xml\n' +
      '• NPR: feeds.npr.org/1001/rss.xml\n\n' +
      'Use the presets below the URL field for quick setup.',
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
    setupGuide:
      'Uses the free ESPN API — no API key needed.\n\n' +
      'Enter league IDs separated by commas.\n\n' +
      'Available leagues: nfl, nba, mlb, nhl, mls, ncaaf, ncaab, wcbb.\n\n' +
      'To filter by specific teams, enter team names separated by commas ' +
      '(e.g. "Buccaneers, Gators, Lakers"). Matching is case-insensitive ' +
      'and partial — "Gators" matches "Florida Gators". Leave blank to show all games.\n\n' +
      'Scores update every 2 minutes during active games.',
    fields: [
      {
        key: 'leagues',
        type: 'string',
        label: 'Leagues',
        description: 'Comma-separated league IDs (e.g. nfl,nba,mlb)',
        default: 'nfl,nba',
        category: 'widget',
      },
      {
        key: 'teams',
        type: 'string',
        label: 'Favorite Teams',
        description:
          'Comma-separated team names to filter (e.g. Buccaneers,Gators,Lakers). Leave blank for all games.',
        category: 'widget',
      },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'CalDAV calendar event sync',
    setupGuide:
      'Connects to any CalDAV server (iCloud, Google via CalDAV, Nextcloud, Radicale, etc.).\n\n' +
      'For iCloud:\n' +
      '• Server URL: https://caldav.icloud.com\n' +
      '• Username: your Apple ID email\n' +
      '• Password: generate an app-specific password at appleid.apple.com\n' +
      '• Calendar Path: leave blank to auto-discover your first calendar\n\n' +
      'For Google Calendar:\n' +
      '• Server URL: https://apidata.googleusercontent.com/caldav/v2\n' +
      '• Use an app password from myaccount.google.com/apppasswords',
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
        description: 'Auto-discovered if blank. Override: /calendars/user@icloud.com/calendar/',
        required: false,
        category: 'integration',
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
    setupGuide:
      'Connects to your Home Assistant instance to display entity states.\n\n' +
      'To get a long-lived access token:\n' +
      '1. Open your Home Assistant UI\n' +
      '2. Click your profile picture (bottom-left)\n' +
      '3. Scroll to "Long-Lived Access Tokens"\n' +
      '4. Click "Create Token", name it "Lensing", and copy the token\n\n' +
      'The URL is your Home Assistant address (e.g. http://homeassistant.local:8123).\n\n' +
      'Domains filter which entity types to show (e.g. light, switch, sensor).',
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
    name: 'Pollen Index',
    description: 'Pollen forecast and allergen triggers via pollen.com (free, no key required)',
    setupGuide:
      'Uses pollen.com for real-time pollen data — no API key needed.\n\n' +
      'Enter your 5-digit US zip code to get local pollen forecasts.\n\n' +
      'The index runs from 0 (none) to 12 (very high). The alert threshold ' +
      'controls when you get notifications — default is 7.3 (medium-high).\n\n' +
      'Data includes yesterday, today, and tomorrow forecasts with ' +
      'specific allergen triggers (tree, grass, weed pollen).',
    fields: [
      {
        key: 'zipCode',
        type: 'string',
        label: 'Zip Code',
        description: '5-digit US zip code (e.g. 90210)',
        required: true,
        category: 'widget',
      },
      {
        key: 'alertThreshold',
        type: 'number',
        label: 'Alert Threshold',
        description: 'Notify when index reaches this level (0-12)',
        default: 7.3,
        min: 0,
        max: 12,
        category: 'widget',
      },
    ],
  },
  {
    id: 'pir',
    name: 'PIR Sensor',
    description: 'Motion detection for automatic display wake/sleep',
    system: true,
    setupGuide:
      'Controls the display backlight using a passive infrared (PIR) motion sensor.\n\n' +
      'Wiring (BCM pin numbering):\n' +
      '• PIR VCC → Pin 2 or 4 (5V power)\n' +
      '• PIR GND → Pin 6 (ground)\n' +
      '• PIR OUT → Pin 7 (GPIO 4) or any free GPIO pin\n\n' +
      'The default GPIO pin is 4. If your sensor is on a different pin, change it above.\n\n' +
      'Idle timeout controls how long after the last motion the screen stays on ' +
      '(default: 5 minutes / 300000 ms).\n\n' +
      'Requires the gpiod package: sudo apt install gpiod',
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
        description: 'Milliseconds without motion before the display sleeps',
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
    setupGuide:
      'Displays photos from a folder on the Pi in a slideshow.\n\n' +
      'Enter the full path to a directory containing images ' +
      '(e.g. /home/pi/photos). Supported formats: jpg, jpeg, png, webp, gif.\n\n' +
      'Photos rotate every 10 minutes. Subdirectories are included.',
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
  {
    id: 'ai-news',
    name: 'AI News Summary',
    description: 'AI-powered headline summaries from RSS feeds',
    setupGuide:
      'Pick news categories below and choose how often to refresh.\n\n' +
      'Uses the same API key from your .env file (ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, ' +
      'or GEMINI_API_KEY) — no extra key needed.\n\n' +
      'Tip: "2x daily" is great for morning and evening updates with minimal API usage.',
    fields: [
      {
        key: 'categories',
        type: 'string',
        label: 'News Categories',
        description: 'Select topics to follow',
        required: true,
        category: 'integration',
      },
      {
        key: 'refreshSchedule',
        type: 'select',
        label: 'Refresh Schedule',
        description: 'How often to fetch and summarize new headlines',
        default: '2x-daily',
        category: 'integration',
        options: [
          { label: '2x daily (morning & evening)', value: '2x-daily' },
          { label: '3x daily', value: '3x-daily' },
          { label: '4x daily (every 6 hours)', value: '4x-daily' },
          { label: 'Hourly', value: 'hourly' },
        ],
      },
      {
        key: 'maxItems',
        type: 'number',
        label: 'Max Headlines',
        description: 'Maximum articles to summarize per refresh',
        default: 10,
        min: 1,
        max: 50,
        category: 'integration',
      },
      {
        key: 'pageSize',
        type: 'number',
        label: 'Headlines Per Page',
        description: 'How many headlines to show at once on the display',
        default: 5,
        min: 1,
        max: 20,
        category: 'integration',
      },
      {
        key: 'rotateSeconds',
        type: 'number',
        label: 'Rotate Every (seconds)',
        description: 'Auto-cycle to next page after this many seconds (0 = manual only)',
        default: 30,
        min: 0,
        max: 300,
        category: 'integration',
      },
      {
        key: 'aiProvider',
        type: 'select',
        label: 'AI Provider',
        default: 'anthropic',
        category: 'integration',
        options: [
          { label: 'Anthropic (Claude)', value: 'anthropic' },
          { label: 'DeepSeek', value: 'deepseek' },
          { label: 'Gemini', value: 'gemini' },
        ],
      },
      {
        key: 'aiModel',
        type: 'select',
        label: 'Model',
        description: 'AI model to use for summarization',
        category: 'integration',
        options: [],
      },
    ],
  },
];

/** IDs of system modules (infrastructure, not dashboard widgets) */
export const SYSTEM_MODULE_IDS: readonly ModuleId[] = MODULE_SCHEMAS.filter((s) => s.system).map(
  (s) => s.id
);

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
