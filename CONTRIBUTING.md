# Contributing to Lensing

Thank you for your interest in contributing to Lensing! This guide will help you get started.

## Development Setup

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 8.0.0

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/lensing.git
cd lensing

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development
pnpm dev
```

### Monorepo Structure

| Package | Description |
|---------|-------------|
| `packages/types` | Shared TypeScript types and interfaces |
| `packages/core` | Core services (scheduler, database, servers) |
| `packages/ui` | UI stores and state management |
| `packages/cli` | CLI commands |
| `apps/display` | SvelteKit display application |

## Creating a Plugin

Lensing uses a plugin system for adding new data sources and widgets. To create a plugin:

1. **Define a manifest** (`plugin.json`):
   ```json
   {
     "name": "my-plugin",
     "version": "0.1.0",
     "type": "widget",
     "displayName": "My Plugin",
     "description": "A brief description of what this plugin does"
   }
   ```

2. **Create a server module** following the factory pattern:
   ```typescript
   export function createMyServer(options: MyServerOptions): MyServerInstance {
     // Implementation
   }
   ```

3. **Add types** to `@lensing/types` for shared interfaces.

4. **Write tests** using Vitest. All new code must have tests.

5. **Export** from the appropriate package index.

### Plugin Submission Guidelines

- Each plugin should have a clear, focused purpose
- Include a `plugin.json` manifest with all required fields
- Follow the existing factory pattern (`createXServer`)
- Add comprehensive tests (aim for >80% coverage)
- Types go in `@lensing/types`, implementation in `@lensing/core`
- UI stores go in `@lensing/ui`
- Document any external API keys or configuration needed

## Pull Request Process

1. **Fork** the repository and create a feature branch
2. **Write tests first** (TDD) for any new functionality
3. **Follow the existing code style** (enforced by ESLint and Prettier)
4. **Run all checks** before submitting:
   ```bash
   pnpm build
   pnpm test
   pnpm lint
   pnpm format:check
   ```
5. **Create a changeset** for version tracking:
   ```bash
   pnpm changeset
   ```
6. **Submit a pull request** with a clear description of changes

### Commit Messages

Follow conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting, no code change
- `refactor:` — Code restructuring
- `test:` — Adding or updating tests
- `chore:` — Build, CI, or tooling changes

### PR Review

- All PRs require at least one review
- CI must pass (type-check, lint, test)
- Maintain or improve test coverage

## Reporting Issues

- Use the **Bug Report** template for bugs
- Use the **Feature Request** template for new ideas
- Use the **Plugin Proposal** template for new plugin ideas

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
