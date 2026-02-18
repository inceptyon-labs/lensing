# Plugin Manifest Schema

The `plugin.json` file defines metadata, entry points, permissions, and configuration for a Lensing plugin.

## Required Fields

### `id: string`

A unique identifier for the plugin. Must be URL-safe (alphanumeric, hyphens, underscores).

```json
"id": "weather-widget"
```

### `name: string`

Human-readable name of the plugin displayed in the UI.

```json
"name": "Weather Widget"
```

### `version: string`

Semantic version of the plugin (e.g., `1.0.0`, `2.1.3-beta`).

```json
"version": "1.0.0"
```

## Optional Fields

### `ui_entry: string`

Path to the compiled UI component entry point. Used when the plugin provides a widget for the display.

```json
"ui_entry": "./dist/widget.js"
```

### `server_entry: string`

Path to the server module entry point. Used when the plugin provides backend services.

```json
"server_entry": "./dist/server.js"
```

### `permissions: object`

Network and resource permissions for the plugin.

#### `permissions.allowed_domains: string[]`

Whitelist of domains the plugin can make HTTP requests to.

```json
"allowed_domains": ["api.openweathermap.org", "api.weather.gov"]
```

#### `permissions.max_refresh_ms: number`

Maximum interval (in milliseconds) between refresh cycles. Prevents DoS attacks.

```json
"max_refresh_ms": 600000  // 10 minutes
```

#### `permissions.max_request_burst: number`

Maximum number of requests the plugin can make in rapid succession.

```json
"max_request_burst": 10
```

#### `permissions.secrets: string[]`

List of environment variable names the plugin needs access to (e.g., API keys). The host provides these at runtime.

```json
"secrets": ["OPENWEATHER_API_KEY", "WEATHER_GOV_KEY"]
```

### `widget_sizes: string[] | object`

Widget size presets the plugin supports. Can be an array of preset names (`"small"`, `"medium"`, `"large"`) or detailed grid span definitions.

```json
"widget_sizes": ["small", "medium", "large"]
```

### `dependencies: string[]`

List of other plugins this plugin depends on. The host will ensure dependencies are loaded first.

```json
"dependencies": ["calendar", "location"]
```

### `config_schema: object`

Schema for plugin configuration fields shown in the admin panel. Each field defines a form input for users to customize the plugin.

#### Field Properties:

- `key: string` — Unique identifier for the field
- `type: string` — Field type: `"string"`, `"number"`, `"boolean"`, or `"select"`
- `label: string` — Display label in the UI
- `description?: string` — Help text
- `default?: any` — Default value if not provided by user
- `required?: boolean` — Whether the field must be filled
- `options?: object[]` — For `"select"` type, array of `{ label, value }`
- `min?: number` — For `"number"` type, minimum allowed value
- `max?: number` — For `"number"` type, maximum allowed value

```json
"config_schema": {
  "fields": [
    {
      "key": "location",
      "type": "string",
      "label": "Location",
      "description": "City or coordinates",
      "required": true
    },
    {
      "key": "units",
      "type": "select",
      "label": "Temperature Units",
      "default": "fahrenheit",
      "options": [
        { "label": "Fahrenheit", "value": "fahrenheit" },
        { "label": "Celsius", "value": "celsius" }
      ]
    }
  ]
}
```

## Validation Rules

The manifest is validated on load:

- All required fields must be present and non-empty
- Field types must match the schema
- `max_refresh_ms` and `max_request_burst` must be positive numbers
- `allowed_domains`, `dependencies`, `secrets`, and `widget_sizes` must be arrays of strings
- If validation fails, the plugin will not load and an error will be reported

## Example

See `plugin.json.example` for a complete working example with all fields.
