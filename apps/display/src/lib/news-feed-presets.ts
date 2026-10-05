/** Preset RSS feeds grouped by category */
export interface FeedPreset {
  label: string;
  url: string;
}

export interface FeedCategory {
  label: string;
  feeds: FeedPreset[];
}

export const FEED_PRESETS: FeedCategory[] = [
  {
    label: 'General',
    feeds: [
      { label: 'BBC Top Stories', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
      { label: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
      {
        label: 'NYT Top Stories',
        url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      },
    ],
  },
  {
    label: 'Tech',
    feeds: [
      { label: 'Hacker News', url: 'https://hnrss.org/frontpage' },
      { label: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
    ],
  },
  {
    label: 'World',
    feeds: [
      { label: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
      { label: 'Guardian World', url: 'https://www.theguardian.com/world/rss' },
    ],
  },
  {
    label: 'Sports',
    feeds: [{ label: 'ESPN', url: 'https://www.espn.com/espn/rss/news' }],
  },
];

/** Flat list of all preset URLs for quick lookup */
export const ALL_PRESET_URLS = new Set(FEED_PRESETS.flatMap((cat) => cat.feeds.map((f) => f.url)));
