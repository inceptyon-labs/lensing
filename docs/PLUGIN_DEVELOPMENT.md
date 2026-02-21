# Plugin Development Guide

A comprehensive guide for developing Lensing plugins—from scaffolding through publication.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Testing](#testing)
4. [Publishing](#publishing)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 18+ with pnpm package manager
- Basic TypeScript and Svelte knowledge
- Understanding of the Lensing plugin architecture (see [PLUGIN_MANIFEST.md](./PLUGIN_MANIFEST.md))

### Scaffolding a New Plugin

The `@lensing/cli` provides a plugin scaffolder that generates a complete starter template.

```bash
# Install or use the Lensing CLI
npm install -g @lensing/cli
# or use directly: npx @lensing/cli

# Create a new plugin
lensing plugin create my-awesome-plugin
```

This creates a directory structure:

```
my-awesome-plugin/
├── plugin.json              # Plugin manifest (metadata, permissions, entry points)
├── MyAwesomePlugin.svelte   # UI component (optional)
├── server.ts                # Server module (optional)
├── MyAwesomePlugin.test.ts  # Test file
├── .gitignore
└── package.json             # Dependencies (created if needed)
```

### Plugin Manifest (`plugin.json`)

The manifest declares your plugin's identity, capabilities, and permissions:

```json
{
  "id": "my-awesome-plugin",
  "name": "my-awesome-plugin",
  "version": "0.1.0",
  "ui_entry": "MyAwesomePlugin.svelte",
  "server_entry": "server.ts",
  "permissions": {
    "allowed_domains": ["api.example.com"],
    "max_refresh_ms": 300000,
    "max_request_burst": 5,
    "secrets": ["API_KEY"]
  },
  "dependencies": [],
  "widget_sizes": ["small", "medium"]
}
```

**Key fields:**

- **id**: Unique plugin identifier (kebab-case, 3-50 characters)
- **name**: Display name
- **version**: Semantic version string
- **ui_entry**: Optional path to the Svelte component
- **server_entry**: Optional path to server module (Node.js)
- **permissions**: Network and resource constraints
  - `allowed_domains`: List of domains the plugin can make requests to
  - `max_refresh_ms`: Minimum milliseconds between refreshes
  - `max_request_burst`: Maximum concurrent HTTP requests
  - `secrets`: Required environment variable names
- **widget_sizes**: Supported display sizes (small/medium/large)

See [PLUGIN_MANIFEST.md](./PLUGIN_MANIFEST.md) for the full specification.

---

## Development Workflow

### Project Structure

```
my-awesome-plugin/
├── plugin.json
├── MyAwesomePlugin.svelte    # UI layer (client-side)
├── server.ts                 # Data fetching (server-side)
├── types.ts                  # Shared types
├── __tests__/
│   ├── MyAwesomePlugin.test.ts
│   └── fixtures/
│       ├── mock-api-response.json
│       └── edge-case-data.json
└── package.json
```

### The UI Component (Svelte)

The Svelte component receives data from the server module and renders the UI.

```svelte
<script>
  import type { MyAwesomePluginData } from './types';

  // Props passed by the host
  export let data: MyAwesomePluginData;
</script>

<div class="my-awesome-plugin">
  <h2>{data.title}</h2>
  <p>{data.description}</p>
</div>

<style>
  .my-awesome-plugin {
    padding: 1rem;
    background: #1a1a1a;
  }
</style>
```

### The Server Module

The server module runs on Node.js and fetches data, validates permissions, and manages state.

```typescript
import type { CacheStore, DataBusInstance } from '@lensing/types';
import type { MyAwesomePluginData } from './types';

export interface MyAwesomePluginServer {
  refresh(): Promise<void>;
  getData(): MyAwesomePluginData;
  onUpdate(callback: (data: MyAwesomePluginData) => void): () => void;
}

export async function createMyAwesomePlugin(options: {
  cache: CacheStore;
  dataBus: DataBusInstance;
  secrets: Record<string, string>;
}): Promise<MyAwesomePluginServer> {
  const { cache, dataBus, secrets } = options;
  let data: MyAwesomePluginData = { title: '', description: '' };
  const listeners: Array<(data: MyAwesomePluginData) => void> = [];

  async function refresh(): Promise<void> {
    try {
      const apiKey = secrets['API_KEY'];
      const response = await fetch('https://api.example.com/data', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const json = await response.json();

      data = {
        title: json.title,
        description: json.description,
      };

      listeners.forEach((cb) => cb(data));
      dataBus.publish('my-awesome-plugin', 'my-awesome-plugin', data);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  }

  function onUpdate(callback: (data: MyAwesomePluginData) => void) {
    listeners.push(callback);
    return () => {
      listeners.splice(listeners.indexOf(callback), 1);
    };
  }

  return { refresh, getData: () => data, onUpdate };
}
```

### Hot Reload Development

Use the dev server to test plugins with automatic reloading on file changes.

```bash
# Start the dev server
lensing dev --plugin ./my-awesome-plugin --fixtures ./fixtures

# The dev server:
# - Watches for changes to plugin.json and Svelte files
# - Reloads on manifest changes
# - Serves mock data from fixtures
# - Validates permissions and manifest integrity
```

The dev server exposes:

- **Manifest loading**: Validates `plugin.json` against the schema
- **File watching**: Auto-reload on changes
- **Fixture loading**: Injects mock data for testing

### Using Fixtures for Mock Data

Fixtures provide mock API responses and test data during development.

Create a `fixtures/` directory with JSON files:

```
fixtures/
├── api-response.json
├── user-data.json
└── edge-cases.json
```

Each file is automatically loaded and accessible via:

```typescript
// In tests or dev server
const fixtures = await fixtureLoader.loadAll();
const apiResponse = fixtures['api-response'];
```

Example fixture (`fixtures/api-response.json`):

```json
{
  "status": 200,
  "data": {
    "title": "Widget Data",
    "description": "Test description",
    "items": [
      { "id": "1", "name": "Item A" },
      { "id": "2", "name": "Item B" }
    ]
  }
}
```

---

## Testing

### Test Setup

Tests use **Vitest**, the fast unit test framework. The scaffold includes a starter test file.

### Writing Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createMyAwesomePlugin } from '../server';
import type { CacheStore, DataBusInstance } from '@lensing/types';

// Mock implementations
const mockCache: CacheStore = {
  read: () => undefined,
  write: () => {},
  getStaleStatus: () => ({ stale: true, found: false }),
  invalidate: () => {},
  readOrFetch: async (_, fetcher) => fetcher(),
};

const mockDataBus: DataBusInstance = {
  publish: () => {},
  subscribe: () => () => {},
  getLatest: () => undefined,
  getChannels: () => [],
  onMessage: () => () => {},
  clear: () => {},
  close: () => {},
};

describe('MyAwesomePlugin', () => {
  let plugin: Awaited<ReturnType<typeof createMyAwesomePlugin>>;

  beforeEach(async () => {
    plugin = await createMyAwesomePlugin({
      cache: mockCache,
      dataBus: mockDataBus,
      secrets: { API_KEY: 'test-key' },
    });
  });

  it('should fetch and return data', async () => {
    await plugin.refresh();
    const data = plugin.getData();
    expect(data.title).toBeDefined();
  });

  it('should notify listeners on update', async () => {
    let received = null;
    plugin.onUpdate((data) => {
      received = data;
    });

    await plugin.refresh();
    expect(received).not.toBeNull();
  });

  it('should handle API errors gracefully', async () => {
    // Mock a failed API call
    // Your error handling should prevent crashes
    await plugin.refresh();
    const data = plugin.getData();
    expect(data).toBeDefined();
  });
});
```

### Test Payloads

Use fixtures in tests to provide consistent, repeatable data:

```typescript
import fs from 'fs';
import path from 'path';

// Load fixture
const fixtureData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../fixtures/api-response.json'), 'utf-8')
);

describe('API Response Handling', () => {
  it('should parse the fixture payload', () => {
    expect(fixtureData.data.items.length).toBe(2);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run a specific test file
npm test -- MyAwesomePlugin.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Harness

The test harness (Vitest) provides:

- **Setup/teardown**: `beforeEach`, `afterEach` hooks
- **Mocking**: Create mock objects matching `@lensing/types` interfaces
- **Assertions**: Full range of expect() matchers
- **Fixtures**: Load JSON test data from files

Example test harness with mock fixture loader:

```typescript
import { createFixtureLoader } from '@lensing/cli';

describe('With Fixture Loader', () => {
  const fixtureLoader = createFixtureLoader({
    fixturesDir: '__tests__/fixtures',
    readDir: async () => ['api-response.json'],
    readFile: async (path) => {
      // Return fixture content
      return '{}';
    },
  });

  it('loads fixtures for testing', async () => {
    const fixtures = await fixtureLoader.loadAll();
    expect(fixtures).toBeDefined();
  });
});
```

---

## Publishing

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes to the plugin API
- **MINOR** (0.X.0): New features, backward compatible
- **PATCH** (0.0.X): Bug fixes

Example progression: `0.1.0` → `0.2.0` (new feature) → `0.2.1` (bug fix) → `1.0.0` (stable)

### Naming Conventions

**Plugin ID format:**

- Kebab-case: `my-awesome-plugin`
- 3-50 characters
- Only alphanumeric and hyphens
- Must start with a letter

Valid: `weather-widget`, `crypto-prices`, `calendar-sync`
Invalid: `WeatherWidget`, `weather_widget`, `123-plugin`

### Pre-Publication Checklist

Before publishing your plugin, verify:

- [ ] `plugin.json` is valid and complete
  ```bash
  lensing validate plugin.json
  ```
- [ ] All tests pass
  ```bash
  npm test
  ```
- [ ] Build succeeds (if using TypeScript)
  ```bash
  npm run build
  ```
- [ ] Code is properly formatted and linted
  ```bash
  npm run format && npm run lint
  ```
- [ ] No secrets or API keys in code (move to `secrets` in manifest)
- [ ] README.md documents the plugin's purpose and usage
- [ ] CHANGELOG.md describes what's new in this version
- [ ] Dependencies are minimal and well-maintained

### Publishing Steps

1. **Prepare your plugin directory**

   ```
   my-awesome-plugin/
   ├── plugin.json
   ├── MyAwesomePlugin.svelte
   ├── server.ts
   ├── types.ts
   ├── __tests__/
   ├── package.json
   ├── README.md              ← Required
   ├── CHANGELOG.md           ← Recommended
   └── LICENSE
   ```

2. **Update version in `plugin.json`**

   ```json
   {
     "version": "1.0.0"
   }
   ```

3. **Create a release package**

   ```bash
   # Build the plugin
   npm run build

   # Package it (tar/zip the directory)
   tar -czf my-awesome-plugin-1.0.0.tar.gz my-awesome-plugin/
   ```

4. **Submit to the Lensing Plugin Registry**

   The registry accepts:
   - GitHub releases (with tarball attachments)
   - NPM packages (@lensing/plugin-my-awesome)
   - Direct file uploads

   Submission process:
   - Create a `plugin-manifest.yml` describing the plugin
   - Include a link to your GitHub repo (recommended for updates)
   - Submit to registry.lensing.io (URL to be confirmed)

5. **Verification**

   The registry verifies:
   - Manifest validity
   - No malicious code patterns
   - All required fields present
   - Version doesn't conflict with existing plugins

### Example `plugin-manifest.yml` for Submission

```yaml
id: my-awesome-plugin
name: 'My Awesome Plugin'
version: '1.0.0'
author: 'Your Name'
description: 'A brief description of what the plugin does'
repository: 'https://github.com/yourusername/my-awesome-plugin'
license: 'MIT'
permissions:
  - 'network:api.example.com'
  - 'secrets:API_KEY'
changelog: |
  ## 1.0.0
  - Initial stable release
  - Full test coverage
  - Documentation complete
```

---

## Troubleshooting

### Common Issues

#### "Invalid plugin name"

**Error:** `Invalid plugin name: "my plugin". Must be 3-50 characters...`

**Solution:** Use kebab-case without spaces:

```bash
lensing plugin create my-plugin  # ✓ correct
lensing plugin create my plugin  # ✗ wrong (space)
lensing plugin create MyPlugin   # ✓ works (converted to my-plugin)
```

#### "Plugin manifest not found"

**Error:** `Invalid plugin manifest: Manifest must be a non-null object`

**Causes:**

- `plugin.json` doesn't exist
- `plugin.json` has invalid JSON syntax
- Wrong file encoding (must be UTF-8)

**Solution:** Verify the manifest:

```bash
# Check the file exists
ls -la my-awesome-plugin/plugin.json

# Validate JSON syntax
cat my-awesome-plugin/plugin.json | jq empty

# Check encoding
file my-awesome-plugin/plugin.json  # should be "JSON text"
```

#### "Field 'X' must be a string"

**Error:** `Field "version" must be a string`

**Cause:** The field value is the wrong type (e.g., number instead of string).

**Solution:** Ensure all required fields are strings in `plugin.json`:

```json
{
  "id": "my-awesome-plugin",
  "name": "my-awesome-plugin",
  "version": "0.1.0" // ← must be a string, not 0.1
}
```

#### Test failures: "Cannot find module"

**Error:** `Cannot find module '@lensing/types'`

**Cause:** Dependencies not installed or TypeScript can't resolve them.

**Solution:**

```bash
# Install dependencies in the plugin directory
npm install
# or if using pnpm
pnpm install

# Rebuild TypeScript
npm run build

# Check tsconfig.json points to the correct module locations
cat tsconfig.json
```

#### Dev server shows stale data

**Issue:** Code changes don't appear in the dev server.

**Cause:** File watcher may have missed changes or fixtures weren't reloaded.

**Solution:**

```bash
# Kill the dev server
Ctrl+C

# Clear any caches
rm -rf .dev-cache node_modules/.vite

# Restart the dev server
lensing dev --plugin ./my-awesome-plugin --fixtures ./fixtures
```

#### "Permission denied" on manifest reload

**Error:** Manifest reload failed with permission denied

**Cause:** File permissions or file locking (file is open in editor).

**Solution:**

- Save and close the file in your editor
- Check file permissions: `chmod 644 plugin.json`
- Restart the dev server

#### API calls blocked by CORS

**Error:** Fetch fails with "CORS policy" error

**Cause:** Domain is not in `allowed_domains` in `plugin.json`.

**Solution:** Add the domain to permissions:

```json
{
  "permissions": {
    "allowed_domains": ["api.example.com", "cdn.example.com"]
  }
}
```

#### Secrets not found at runtime

**Error:** `API_KEY is undefined` during plugin execution

**Cause:** Secret environment variable not set or not declared in manifest.

**Solution:**

1. Declare in manifest:
   ```json
   {
     "permissions": {
       "secrets": ["API_KEY"]
     }
   }
   ```
2. Set environment variable before running:
   ```bash
   export API_KEY="your-secret-key"
   lensing dev --plugin ./my-awesome-plugin
   ```

#### "Too many requests" errors

**Error:** HTTP 429 "Too Many Requests"

**Cause:** Exceeding `max_refresh_ms` or `max_request_burst` limits.

**Solution:** Adjust permissions in `plugin.json`:

```json
{
  "permissions": {
    "max_refresh_ms": 60000, // Minimum 1 minute between refreshes
    "max_request_burst": 10 // Allow up to 10 concurrent requests
  }
}
```

### Getting Help

- **Documentation**: Read [PLUGIN_MANIFEST.md](./PLUGIN_MANIFEST.md) for detailed specs
- **Examples**: See `docs/examples/` for sample plugins
- **GitHub Issues**: Report bugs on the [Lensing repository](https://github.com/lensing/lensing/issues)
- **Community**: Join the discussion forum at [community.lensing.io](https://community.lensing.io)

---

## Next Steps

- **Build your plugin**: Use the scaffold and follow this guide
- **Test thoroughly**: Cover edge cases and API errors
- **Read the manifest spec**: [PLUGIN_MANIFEST.md](./PLUGIN_MANIFEST.md)
- **Review example plugins**: `docs/examples/`
- **Publish to registry**: Share your plugin with the community
