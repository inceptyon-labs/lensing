import { describe, it, expect } from 'vitest';
import { parseTemplate, renderTemplate, escapeHtml } from '../lib/template-engine';

describe('Template Engine', () => {
  describe('escapeHtml', () => {
    it('escapes < character', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    it('escapes > character', () => {
      expect(escapeHtml('a > b')).toBe('a &gt; b');
    });

    it('escapes & character', () => {
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('escapes double quote', () => {
      expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('escapes single quote', () => {
      expect(escapeHtml("it's fine")).toBe('it&#39;s fine');
    });

    it('escapes all characters together', () => {
      expect(escapeHtml('<div class="danger" & \'alert\'>alert()</div>')).toBe(
        '&lt;div class=&quot;danger&quot; &amp; &#39;alert&#39;&gt;alert()&lt;/div&gt;'
      );
    });

    it('returns empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('leaves safe text unchanged', () => {
      expect(escapeHtml('Hello World 123')).toBe('Hello World 123');
    });
  });

  describe('parseTemplate', () => {
    it('parses simple text without placeholders', () => {
      const template = 'Hello World';
      const tokens = parseTemplate(template);
      expect(tokens.length).toBe(1);
      expect(tokens[0]).toEqual({ type: 'text', value: 'Hello World' });
    });

    it('parses simple {{field}} placeholder', () => {
      const tokens = parseTemplate('Hello {{name}}');
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ type: 'text', value: 'Hello ' });
      expect(tokens[1]).toEqual({ type: 'placeholder', path: 'name' });
      expect(tokens[2]).toEqual({ type: 'text', value: '' });
    });

    it('parses multiple placeholders', () => {
      const tokens = parseTemplate('{{first}} {{second}}');
      expect(tokens.length).toBe(5);
      expect(tokens[0]).toEqual({ type: 'text', value: '' }); // empty leading text
      expect(tokens[1]).toEqual({ type: 'placeholder', path: 'first' });
      expect(tokens[2]).toEqual({ type: 'text', value: ' ' });
      expect(tokens[3]).toEqual({ type: 'placeholder', path: 'second' });
    });

    it('parses dot-path {{nested.field}}', () => {
      const tokens = parseTemplate('{{user.name}}');
      expect(tokens.length).toBe(3);
      expect(tokens[0]).toEqual({ type: 'text', value: '' }); // empty text before placeholder
      expect(tokens[1]).toEqual({ type: 'placeholder', path: 'user.name' });
    });

    it('parses array index {{items[0]}}', () => {
      const tokens = parseTemplate('{{items[0]}}');
      expect(tokens.some((t) => t.type === 'placeholder' && t.path === 'items[0]')).toBe(true);
    });

    it('parses array index with nested path {{items[0].title}}', () => {
      const tokens = parseTemplate('{{items[0].title}}');
      expect(tokens.some((t) => t.type === 'placeholder' && t.path === 'items[0].title')).toBe(
        true
      );
    });

    it('parses {{#each items}}...{{/each}} block', () => {
      const tokens = parseTemplate('{{#each items}}<div>{{name}}</div>{{/each}}');
      expect(tokens.some((t) => t.type === 'block')).toBe(true);
      const block = tokens.find((t) => t.type === 'block') as any;
      expect(block.variable).toBe('items');
      expect(block.content).toContain('{{name}}');
    });

    it('parses mixed content with text, placeholders, and blocks', () => {
      const template = 'Header {{#each items}}<li>{{this}}</li>{{/each}} Footer';
      const tokens = parseTemplate(template);
      expect(tokens.some((t) => t.type === 'text' && t.value.includes('Header'))).toBe(true);
      expect(tokens.some((t) => t.type === 'block')).toBe(true);
      expect(tokens.some((t) => t.type === 'text' && t.value.includes('Footer'))).toBe(true);
    });
  });

  describe('renderTemplate', () => {
    it('renders simple text without data', () => {
      const result = renderTemplate('Hello World', {});
      expect(result).toBe('Hello World');
    });

    it('renders simple {{field}} with data', () => {
      const result = renderTemplate('Hello {{name}}', { name: 'Alice' });
      expect(result).toBe('Hello Alice');
    });

    it('renders nested {{path.field}}', () => {
      const result = renderTemplate('Temp: {{weather.temp}}°F', {
        weather: { temp: 72 },
      });
      expect(result).toBe('Temp: 72°F');
    });

    it('renders array index {{items[0]}}', () => {
      const result = renderTemplate('First: {{items[0]}}', { items: ['apple', 'banana'] });
      expect(result).toBe('First: apple');
    });

    it('renders array index with nested path {{items[0].title}}', () => {
      const result = renderTemplate('Title: {{items[0].title}}', {
        items: [{ title: 'My Post' }],
      });
      expect(result).toBe('Title: My Post');
    });

    it('escapes HTML in interpolated values', () => {
      const result = renderTemplate('Message: {{text}}', { text: '<script>alert()</script>' });
      expect(result).toBe('Message: &lt;script&gt;alert()&lt;/script&gt;');
    });

    it('renders {{#each items}} block', () => {
      const result = renderTemplate('Items: {{#each items}}<li>{{this}}</li>{{/each}}', {
        items: ['a', 'b', 'c'],
      });
      expect(result).toContain('<li>a</li>');
      expect(result).toContain('<li>b</li>');
      expect(result).toContain('<li>c</li>');
    });

    it('renders {{#each}} with nested object and {{this}}', () => {
      const result = renderTemplate('{{#each names}}{{this}} {{/each}}', {
        names: ['Alice', 'Bob', 'Charlie'],
      });
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
      expect(result).toContain('Charlie');
    });

    it('renders {{#each}} with object properties inside', () => {
      const result = renderTemplate('{{#each items}}<div>{{title}}: {{price}}</div>{{/each}}', {
        items: [
          { title: 'Apple', price: 1.5 },
          { title: 'Banana', price: 0.8 },
        ],
      });
      expect(result).toContain('<div>Apple: 1.5</div>');
      expect(result).toContain('<div>Banana: 0.8</div>');
    });

    it('renders {{#each}} with {{this}} for string items', () => {
      const result = renderTemplate('{{#each tags}}<span>{{this}}</span>{{/each}}', {
        tags: ['red', 'blue', 'green'],
      });
      expect(result).toContain('<span>red</span>');
      expect(result).toContain('<span>blue</span>');
      expect(result).toContain('<span>green</span>');
    });

    it('escapes HTML in {{#each}} block values', () => {
      const result = renderTemplate('{{#each items}}<li>{{title}}</li>{{/each}}', {
        items: [{ title: '<dangerous>' }],
      });
      expect(result).toContain('<li>&lt;dangerous&gt;</li>');
    });

    it('returns placeholders unchanged when data is null', () => {
      const result = renderTemplate('Hello {{name}}', null);
      expect(result).toBe('Hello {{name}}');
    });

    it('returns placeholders unchanged when data is undefined', () => {
      const result = renderTemplate('Hello {{name}}', undefined);
      expect(result).toBe('Hello {{name}}');
    });

    it('replaces missing fields with empty string', () => {
      const result = renderTemplate('Hello {{name}}', {});
      expect(result).toBe('Hello ');
    });

    it('replaces missing nested paths with empty string', () => {
      const result = renderTemplate('Temp: {{weather.temp}}', { weather: {} });
      expect(result).toBe('Temp: ');
    });

    it('handles {{#each}} with missing array as empty', () => {
      const result = renderTemplate('{{#each items}}<li>{{this}}</li>{{/each}}', {});
      expect(result).not.toContain('<li>');
    });

    it('handles {{#each}} with null array as empty', () => {
      const result = renderTemplate('{{#each items}}<li>{{this}}</li>{{/each}}', {
        items: null,
      });
      expect(result).not.toContain('<li>');
    });

    it('renders empty array gracefully', () => {
      const result = renderTemplate('Start{{#each items}}<li>{{this}}</li>{{/each}}End', {
        items: [],
      });
      expect(result).toBe('StartEnd');
    });

    it('handles template with both placeholders and {{#each}} blocks', () => {
      const template = 'Name: {{name}}, Items: {{#each items}}<span>{{this}}</span>{{/each}}';
      const result = renderTemplate(template, {
        name: 'Alice',
        items: ['a', 'b'],
      });
      expect(result).toContain('Name: Alice');
      expect(result).toContain('<span>a</span>');
      expect(result).toContain('<span>b</span>');
    });

    it('handles number values', () => {
      const result = renderTemplate('Count: {{count}}', { count: 42 });
      expect(result).toBe('Count: 42');
    });

    it('handles boolean values', () => {
      const result = renderTemplate('Active: {{active}}', { active: true });
      expect(result).toBe('Active: true');
    });

    it('resolves bracket notation for keys with spaces', () => {
      const result = renderTemplate('{{["Global Quote"]["01. symbol"]}}', {
        'Global Quote': { '01. symbol': 'AAPL' },
      });
      expect(result).toBe('AAPL');
    });

    it('resolves bracket notation with single quotes', () => {
      const result = renderTemplate("{{['data']['key name']}}", {
        data: { 'key name': 'value' },
      });
      expect(result).toBe('value');
    });

    it('mixes dot and bracket notation', () => {
      const result = renderTemplate('{{response["Global Quote"]["05. price"]}}', {
        response: { 'Global Quote': { '05. price': '150.25' } },
      });
      expect(result).toBe('150.25');
    });

    it('resolves bracket notation with numeric index', () => {
      const result = renderTemplate('{{items[1]}}', { items: ['a', 'b', 'c'] });
      expect(result).toBe('b');
    });
  });
});
