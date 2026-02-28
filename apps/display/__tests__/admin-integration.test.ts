import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Acceptance Criteria ────────────────────────────────────────────────────
// - Settings page shows integration fields grouped by module
// - Only modules that HAVE integration fields are shown
// - Save triggers module restart if integration was updated
// - Password fields redacted as before

describe('AdminConfigForm: Integration fields only (lensing-zgdi)', () => {
  const formPath = join(__dirname, '../src/lib/AdminConfigForm.svelte');

  it('should import getIntegrationFields from @lensing/types', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain('getIntegrationFields');
  });

  it('should filter fields to integration-category fields', () => {
    const source = readFileSync(formPath, 'utf-8');
    // Should use getIntegrationFields or filter by category === 'integration'
    expect(source).toMatch(/getIntegrationFields|category.*integration|integration.*category/);
  });

  it('should still show uncategorized fields for backward compatibility', () => {
    const source = readFileSync(formPath, 'utf-8');
    // Should check for !f.category to include uncategorized fields
    expect(source).toMatch(/!f\.category|!field\.category|uncategorized|backward/i);
  });

  it('should still support password field type', () => {
    const source = readFileSync(formPath, 'utf-8');
    expect(source).toContain("field.type === 'password'");
  });
});

describe('AdminPluginList: All modules with config schemas (lensing-zgdi)', () => {
  const listPath = join(__dirname, '../src/lib/AdminPluginList.svelte');

  it('should show all builtin modules that have a config schema', () => {
    const source = readFileSync(listPath, 'utf-8');
    // Should filter to builtins with config_schema (not limited to integration-only)
    expect(source).toMatch(/p\.builtin\s*&&\s*p\.manifest\.config_schema/);
  });
});

describe('AdminPluginCard: Auto-restart on integration save (lensing-zgdi)', () => {
  const cardPath = join(__dirname, '../src/lib/AdminPluginCard.svelte');

  it('should auto-restart module after config save for built-in modules', () => {
    const source = readFileSync(cardPath, 'utf-8');
    // Should automatically trigger restart after saving config
    expect(source).toMatch(/restart.*save|save.*restart|auto.*restart/i);
  });
});
