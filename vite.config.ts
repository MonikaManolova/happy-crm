import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works from any sub-path (e.g. GitHub Pages).
  base: './',
  test: {
    include: ['src/**/*.test.ts'],
  },
});
