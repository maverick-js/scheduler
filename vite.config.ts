/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  // https://vitest.dev/config
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true,
  },
});
