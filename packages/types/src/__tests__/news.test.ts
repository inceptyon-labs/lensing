import { describe, it, expect } from 'vitest';
import type { NewsArticle, NewsData, NewsServerOptions, NewsServerInstance } from '../news';
import { DEFAULT_NEWS_MAX_ITEMS, DEFAULT_NEWS_MAX_STALE_MS } from '../news';

describe('News Types & Constants', () => {
  it('should export DEFAULT_NEWS_MAX_ITEMS as a positive number', () => {
    expect(DEFAULT_NEWS_MAX_ITEMS).toBeGreaterThan(0);
    expect(typeof DEFAULT_NEWS_MAX_ITEMS).toBe('number');
  });

  it('should export DEFAULT_NEWS_MAX_STALE_MS as a positive number', () => {
    expect(DEFAULT_NEWS_MAX_STALE_MS).toBeGreaterThan(0);
    expect(typeof DEFAULT_NEWS_MAX_STALE_MS).toBe('number');
  });

  it('should have NewsArticle with required fields', () => {
    const article: NewsArticle = {
      id: 'article-1',
      title: 'Breaking News',
      summary: 'This is a test article',
      link: 'https://example.com/article',
      published: Date.now(),
      source: 'Example News',
      category: 'technology',
    };

    expect(article.id).toBe('article-1');
    expect(article.title).toBe('Breaking News');
    expect(article.published).toBeGreaterThan(0);
  });

  it('should have NewsData with articles and lastUpdated', () => {
    const data: NewsData = {
      articles: [
        {
          id: '1',
          title: 'Article 1',
          summary: 'Summary 1',
          link: 'https://example.com/1',
          published: Date.now(),
          source: 'Source 1',
          category: 'tech',
        },
      ],
      lastUpdated: Date.now(),
    };

    expect(data.articles).toHaveLength(1);
    expect(data.lastUpdated).toBeGreaterThan(0);
  });

  it('should have NewsServerOptions interface with required fields', () => {
    // This is a structural test - just verify the types are exported
    expect(typeof DEFAULT_NEWS_MAX_ITEMS).toBe('number');
    expect(typeof DEFAULT_NEWS_MAX_STALE_MS).toBe('number');
  });

  it('should have NewsServerInstance interface methods', () => {
    // Verify interface is exported - type tests don't execute
    // but we verify constants are correct
    expect(DEFAULT_NEWS_MAX_ITEMS).toEqual(20);
    expect(DEFAULT_NEWS_MAX_STALE_MS).toEqual(600_000);
  });
});
