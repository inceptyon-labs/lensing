import fs from 'fs';
import path from 'path';

export function validatePluginName(name: string): boolean {
  if (name.length < 3 || name.length > 50) {
    return false;
  }

  // Must start with a letter; only allow alphanumeric and hyphens
  const validPattern = /^[a-zA-Z][a-zA-Z0-9-]*$/;
  return validPattern.test(name);
}

export function generatePluginId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function toPascalCase(name: string): string {
  return name
    .split(/[-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function createPluginScaffold(name: string, targetDir: string): void {
  if (!validatePluginName(name)) {
    throw new Error(`Invalid plugin name: "${name}". Must be 3-50 characters, start with a letter, and contain only letters, numbers, and hyphens.`);
  }

  const pluginId = generatePluginId(name);
  const componentName = toPascalCase(name);
  const pluginPath = path.join(targetDir, pluginId);

  // Check if directory already exists
  if (fs.existsSync(pluginPath)) {
    throw new Error(`Plugin directory already exists: ${pluginPath}`);
  }

  // Create plugin directory
  fs.mkdirSync(pluginPath, { recursive: true });

  // Create plugin.json
  const manifest = {
    id: pluginId,
    name: pluginId,
    version: '0.1.0',
    type: 'plugin',
    allowed_domains: [],
    dependencies: [],
  };
  fs.writeFileSync(path.join(pluginPath, 'plugin.json'), JSON.stringify(manifest, null, 2));

  // Create Svelte component
  const componentContent = `<script>
  export let data;
</script>

<div class="${pluginId}">
  <h2>${componentName}</h2>
  <p>Your plugin content goes here</p>
</div>

<style>
  .${pluginId} {
    padding: 1rem;
  }
</style>
`;
  fs.writeFileSync(path.join(pluginPath, `${componentName}.svelte`), componentContent);

  // Create server module
  const serverContent = `export interface ${componentName}Data {
  // Define your data structure here
}

export async function fetchData(): Promise<${componentName}Data> {
  // Implement your data fetching logic here
  return {};
}
`;
  fs.writeFileSync(path.join(pluginPath, 'server.ts'), serverContent);

  // Create test file
  const testContent = `import { describe, it, expect } from 'vitest';
import ${componentName} from './${componentName}.svelte';

describe('${componentName}', () => {
  it('should render correctly', () => {
    // Add your tests here
    expect(true).toBe(true);
  });
});
`;
  fs.writeFileSync(path.join(pluginPath, `${componentName}.test.ts`), testContent);

  // Create .gitignore
  const gitignoreContent = `node_modules/
dist/
.DS_Store
*.log
`;
  fs.writeFileSync(path.join(pluginPath, '.gitignore'), gitignoreContent);
}
