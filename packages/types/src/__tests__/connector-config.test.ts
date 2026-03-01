import { describe, it, expect } from 'vitest';
import type {
  ConnectorConfig,
  JsonApiConnectorConfig,
  RssConnectorConfig,
  StaticConnectorConfig,
  ConnectorMapping,
} from '../index';

describe('ConnectorConfig Types', () => {
  describe('JSON API Connector', () => {
    it('creates valid JSON API config with required fields', () => {
      const config: JsonApiConnectorConfig = {
        type: 'json-api',
        url: 'https://api.example.com/data',
        method: 'GET',
        refresh_ms: 300000,
        mapping: {
          title: '$.data.title',
          description: '$.data.desc',
        },
      };

      expect(config.type).toBe('json-api');
      expect(config.url).toBe('https://api.example.com/data');
      expect(config.method).toBe('GET');
      expect(config.refresh_ms).toBe(300000);
      expect(config.mapping.title).toBe('$.data.title');
    });

    it('supports optional headers in JSON API config', () => {
      const config: JsonApiConnectorConfig = {
        type: 'json-api',
        url: 'https://api.example.com/data',
        method: 'POST',
        headers: {
          Authorization: 'Bearer token123',
          'Content-Type': 'application/json',
        },
        refresh_ms: 300000,
        mapping: {},
      };

      expect(config.headers).toBeDefined();
      expect(config.headers!['Authorization']).toBe('Bearer token123');
    });

    it('supports different HTTP methods', () => {
      const methods: Array<JsonApiConnectorConfig['method']> = [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
      ];

      methods.forEach((method) => {
        const config: JsonApiConnectorConfig = {
          type: 'json-api',
          url: 'https://api.example.com',
          method,
          refresh_ms: 300000,
          mapping: {},
        };
        expect(config.method).toBe(method);
      });
    });

    it('supports complex JSONPath expressions in mapping', () => {
      const config: JsonApiConnectorConfig = {
        type: 'json-api',
        url: 'https://api.example.com/data',
        method: 'GET',
        refresh_ms: 300000,
        mapping: {
          title: '$.articles[0].title',
          description: '$.articles[*].description',
          author: '$..author.name',
          date: '$.metadata.lastUpdated',
        },
      };

      expect(config.mapping.title).toBe('$.articles[0].title');
      expect(config.mapping.description).toBe('$.articles[*].description');
      expect(config.mapping.author).toBe('$..author.name');
    });
  });

  describe('RSS Connector', () => {
    it('creates valid RSS config with required fields', () => {
      const config: RssConnectorConfig = {
        type: 'rss',
        url: 'https://example.com/feed.xml',
        refresh_ms: 300000,
        mapping: {
          title: 'title',
          link: 'link',
          description: 'description',
          date: 'pubDate',
          image: 'image.url',
        },
      };

      expect(config.type).toBe('rss');
      expect(config.url).toBe('https://example.com/feed.xml');
      expect(config.refresh_ms).toBe(300000);
      expect(config.mapping.title).toBe('title');
    });

    it('allows partial RSS field mapping', () => {
      const config: RssConnectorConfig = {
        type: 'rss',
        url: 'https://example.com/feed.xml',
        refresh_ms: 300000,
        mapping: {
          title: 'title',
          description: 'description',
        },
      };

      expect(Object.keys(config.mapping).length).toBe(2);
      expect(config.mapping.title).toBe('title');
    });

    it('supports custom field mappings for RSS', () => {
      const config: RssConnectorConfig = {
        type: 'rss',
        url: 'https://example.com/feed.xml',
        refresh_ms: 300000,
        mapping: {
          title: 'item > title',
          image: 'item > thumbnail[src]',
          customField: 'item > custom:field',
        },
      };

      expect(config.mapping.customField).toBe('item > custom:field');
    });
  });

  describe('Static Connector', () => {
    it('creates valid static config with data object', () => {
      const data = {
        title: 'Fixed Title',
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
        metadata: {
          version: '1.0',
          lastUpdated: '2026-02-28',
        },
      };

      const config: StaticConnectorConfig = {
        type: 'static',
        data,
      };

      expect(config.type).toBe('static');
      expect(config.data.title).toBe('Fixed Title');
      expect(config.data.items).toHaveLength(2);
      expect(config.data.metadata.version).toBe('1.0');
    });

    it('supports empty static data object', () => {
      const config: StaticConnectorConfig = {
        type: 'static',
        data: {},
      };

      expect(config.type).toBe('static');
      expect(Object.keys(config.data).length).toBe(0);
    });

    it('supports various data types in static config', () => {
      const config: StaticConnectorConfig = {
        type: 'static',
        data: {
          string: 'value',
          number: 42,
          boolean: true,
          null: null,
          array: [1, 2, 3],
          object: { nested: 'value' },
        },
      };

      expect(config.data.string).toBe('value');
      expect(config.data.number).toBe(42);
      expect(config.data.boolean).toBe(true);
      expect(config.data.null).toBeNull();
      expect(config.data.array).toHaveLength(3);
      expect(config.data.object.nested).toBe('value');
    });
  });

  describe('ConnectorConfig Union Type', () => {
    it('accepts JSON API config in union', () => {
      const config: ConnectorConfig = {
        type: 'json-api',
        url: 'https://api.example.com',
        method: 'GET',
        refresh_ms: 300000,
        mapping: {},
      };

      expect(config.type).toBe('json-api');
    });

    it('accepts RSS config in union', () => {
      const config: ConnectorConfig = {
        type: 'rss',
        url: 'https://example.com/feed.xml',
        refresh_ms: 300000,
        mapping: { title: 'title' },
      };

      expect(config.type).toBe('rss');
    });

    it('accepts static config in union', () => {
      const config: ConnectorConfig = {
        type: 'static',
        data: { title: 'Static Data' },
      };

      expect(config.type).toBe('static');
    });

    it('discriminates union by type field at compile time', () => {
      const jsonApiConfig: ConnectorConfig = {
        type: 'json-api',
        url: 'https://api.example.com',
        method: 'GET',
        refresh_ms: 300000,
        mapping: {},
      };

      const rssConfig: ConnectorConfig = {
        type: 'rss',
        url: 'https://example.com/feed.xml',
        refresh_ms: 300000,
        mapping: {},
      };

      const staticConfig: ConnectorConfig = {
        type: 'static',
        data: {},
      };

      const configs: ConnectorConfig[] = [jsonApiConfig, rssConfig, staticConfig];
      expect(configs).toHaveLength(3);
    });
  });

  describe('ConnectorMapping Type', () => {
    it('creates mapping from field names to JSONPath expressions', () => {
      const mapping: ConnectorMapping = {
        title: '$.title',
        description: '$.body',
        link: '$.url',
      };

      expect(Object.keys(mapping)).toHaveLength(3);
      expect(mapping.title).toBe('$.title');
    });

    it('supports arbitrary field names in mapping', () => {
      const mapping: ConnectorMapping = {
        customField1: '$.data.field1',
        customField2: '$.data.field2',
        anotherField: '$.metadata.value',
      };

      expect(mapping.customField1).toBe('$.data.field1');
      expect(mapping.anotherField).toBe('$.metadata.value');
    });

    it('allows empty mapping object', () => {
      const mapping: ConnectorMapping = {};
      expect(Object.keys(mapping).length).toBe(0);
    });
  });

  describe('Configuration Combinations', () => {
    it('JSON API with full configuration', () => {
      const config: ConnectorConfig = {
        type: 'json-api',
        url: 'https://api.weather.example.com/v1/forecast',
        method: 'POST',
        headers: {
          Authorization: 'Bearer secret-token',
          Accept: 'application/json',
        },
        refresh_ms: 600000, // 10 minutes
        mapping: {
          temperature: '$.main.temp',
          description: '$.weather[0].description',
          humidity: '$.main.humidity',
          windSpeed: '$.wind.speed',
        },
      };

      expect(config.type).toBe('json-api');
      if (config.type === 'json-api') {
        expect(config.headers).toBeDefined();
        expect(config.method).toBe('POST');
      }
    });

    it('RSS with multiple field mappings', () => {
      const config: ConnectorConfig = {
        type: 'rss',
        url: 'https://news.example.com/feed',
        refresh_ms: 600000,
        mapping: {
          title: 'title',
          description: 'description',
          link: 'link',
          date: 'pubDate',
          image: 'image',
          author: 'author',
        },
      };

      expect(config.type).toBe('rss');
      if (config.type === 'rss') {
        expect(Object.keys(config.mapping)).toHaveLength(6);
      }
    });

    it('Static config with complex nested data', () => {
      const config: ConnectorConfig = {
        type: 'static',
        data: {
          widget: {
            title: 'Dashboard',
            sections: [
              {
                id: 'metrics',
                items: [
                  { label: 'CPU', value: 45 },
                  { label: 'Memory', value: 62 },
                ],
              },
            ],
          },
        },
      };

      expect(config.type).toBe('static');
      if (config.type === 'static') {
        expect(config.data.widget.title).toBe('Dashboard');
      }
    });
  });
});
