import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Style preprocessing crashes under vitest and no component uses a CSS preprocessor
  preprocess: vitePreprocess({ style: !process.env.VITEST }),
  onwarn(warning, handler) {
    if (warning.code.startsWith('a11y_')) return;
    handler(warning);
  },
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
    }),
  },
};

export default config;
