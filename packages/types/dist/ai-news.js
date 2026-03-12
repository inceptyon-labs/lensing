/** Default max articles to summarize */
export const DEFAULT_AI_NEWS_MAX_ITEMS = 10;
/** Default max staleness in ms (30 minutes — longer due to LLM cost) */
export const DEFAULT_AI_NEWS_MAX_STALE_MS = 1_800_000;
/** Curated news categories with reliable RSS feeds */
export const AI_NEWS_CATEGORIES = [
    {
        id: 'top-news',
        label: 'Top News',
        feeds: [
            'https://feeds.bbci.co.uk/news/rss.xml',
            'https://feeds.npr.org/1001/rss.xml',
            'https://rsshub.app/apnews/topics/apf-topnews',
        ],
    },
    {
        id: 'technology',
        label: 'Technology',
        feeds: [
            'https://hnrss.org/frontpage',
            'https://feeds.arstechnica.com/arstechnica/index',
        ],
    },
    {
        id: 'world',
        label: 'World',
        feeds: [
            'https://feeds.bbci.co.uk/news/world/rss.xml',
            'https://www.reutersagency.com/feed/',
        ],
    },
    {
        id: 'business',
        label: 'Business & Finance',
        feeds: [
            'https://feeds.bbci.co.uk/news/business/rss.xml',
            'https://feeds.marketwatch.com/marketwatch/topstories',
        ],
    },
    {
        id: 'science',
        label: 'Science & Health',
        feeds: [
            'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
            'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
        ],
    },
    {
        id: 'sports',
        label: 'Sports',
        feeds: ['https://www.espn.com/espn/rss/news'],
    },
    {
        id: 'entertainment',
        label: 'Entertainment',
        feeds: ['https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'],
    },
];
/** Resolve category IDs to deduplicated feed URLs */
export function resolveCategoriesToFeeds(categoryIds) {
    const idSet = new Set(categoryIds);
    const feeds = [];
    for (const cat of AI_NEWS_CATEGORIES) {
        if (idSet.has(cat.id)) {
            feeds.push(...cat.feeds);
        }
    }
    return [...new Set(feeds)];
}
/** Schedule presets mapping to refresh intervals in ms */
export const AI_NEWS_SCHEDULES = {
    '2x-daily': 43_200_000, // 12 hours
    '3x-daily': 28_800_000, // 8 hours
    '4x-daily': 21_600_000, // 6 hours
    hourly: 3_600_000, // 1 hour
};
//# sourceMappingURL=ai-news.js.map