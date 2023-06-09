/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// @ts-ignore
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    minify: 'esbuild',
    lib: {
      entry: './lib/index.umd.ts',
      formats: ['umd'],
      fileName: (filename) => `${pkg.name.split('/')[1]}-${filename}.js`,
      name: 'mthPagination'
    },
    rollupOptions: {
      external: [...Object.keys(pkg.peerDependencies)],
      output: {
        sourcemap: true,
        exports: 'default'
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
  },
});
