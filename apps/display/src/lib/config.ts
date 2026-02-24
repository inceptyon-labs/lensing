/** Names of the five display zones */
export const ZONE_NAMES = ['top-bar', 'left-col', 'center', 'right-col', 'bottom-bar'] as const;

export type ZoneName = (typeof ZONE_NAMES)[number];

/** Configuration for a single zone's internal grid */
export interface ZoneConfig {
  name: ZoneName | string;
  rows: number;
  columns: number;
}

/** Full layout configuration */
export interface LayoutConfig {
  zones: ZoneConfig[];
}

/** Default layout: 5 zones, each with a 1-column single grid */
export const DEFAULT_LAYOUT: LayoutConfig = {
  zones: [
    { name: 'top-bar', rows: 1, columns: 4 },
    { name: 'left-col', rows: 3, columns: 1 },
    { name: 'center', rows: 3, columns: 2 },
    { name: 'right-col', rows: 3, columns: 1 },
    { name: 'bottom-bar', rows: 1, columns: 4 },
  ],
};

/** Maps built-in plugin IDs to their display component names */
export const BUILTIN_PLUGIN_MAP: Record<string, string> = {
  'photo-slideshow': 'PhotoSlideshow',
  'news-server': 'NewsHeadlines',
  'sports-server': 'SportsScores',
  'home-assistant-server': 'HomeAssistantDevices',
};

/** Build an inline style string for a zone's internal CSS grid */
export function createZoneStyle(config: ZoneConfig): string {
  return [
    `grid-template-rows: repeat(${config.rows}, 1fr)`,
    `grid-template-columns: repeat(${config.columns}, 1fr)`,
  ].join('; ');
}
