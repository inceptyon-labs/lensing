import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const API_TARGET = process.env.LENSING_API_URL ?? 'http://localhost:3100';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/modules': { target: API_TARGET },
      '/plugins': { target: API_TARGET },
      '/settings': { target: API_TARGET },
      '/layout': { target: API_TARGET },
      '/ask': { target: API_TARGET },
      '/display': { target: API_TARGET },
      '/api': { target: API_TARGET },
      '/marketplace': { target: API_TARGET },
      '/photos': { target: API_TARGET },
      '/ws': { target: API_TARGET, ws: true },
    },
  },
  test: {
    include: ['src/__tests__/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.ts'],
  },
  // Only override under vitest: an empty list replaces Vite's default client conditions,
  // which made production bundles import Svelte's server lifecycle functions
  ...(process.env.VITEST ? { resolve: { conditions: ['browser'] } } : {}),
});
